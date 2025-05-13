import { useStore } from "../../../app/stores/store.ts";
import Button from "../../ui/button/Button.tsx";
import { useNavigate } from "react-router";
import { useState } from "react";
import Modal from "../../ui/modal";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text,
  addButtonLink?: string;
  addButtonText?: string;
  addButtonStyle?: string;
  modalContent?: React.ReactNode;
  modalClose?: () => void;
  onModalOpen?: () => void;
  modalStyle?: string;
  useModal?: boolean;
  isModalOpen?: boolean;
  additionalButtons?: React.ReactNode; // Add support for additional buttons
  onSearch?: (term: string) => void; // Optional search handler
  searchPlaceholder?: string;
}

const TableComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  addButtonLink = "",
  addButtonText = "",
  addButtonStyle = "",
  modalContent,
  modalClose,
  onModalOpen,
  modalStyle = "",
  useModal = false,
  isModalOpen: externalIsModalOpen,
  additionalButtons,
  onSearch,
  searchPlaceholder = "Tìm kiếm...",
}) => {
  const [internalIsModalOpen, setInternalIsModalOpen] = useState(false);
  const isModalOpen =
    externalIsModalOpen !== undefined
      ? externalIsModalOpen
      : internalIsModalOpen;
  const navigate = useNavigate();
  const { productStore } = useStore();
  const [searchValue, setSearchValue] = useState("");

  const handleAddClick = () => {
    if (useModal && modalContent) {
      if (onModalOpen) onModalOpen();
      setInternalIsModalOpen(true);
    } else {
      navigate("/" + addButtonLink);
      productStore.resetProductForm();
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    if (onSearch) onSearch(searchValue);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {addButtonLink && (
            <Button
              type="button"
              onClick={handleAddClick}
              className={
                addButtonStyle
                  ? addButtonStyle
                  : "ml-4 h-8 py-5 font-semibold rounded bg-sky-700 hover:bg-sky-800"
              }
            >
              {addButtonText}
            </Button>
          )}

          {additionalButtons}
        </div>
        {onSearch && (
          <div className="flex items-center">
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchKeyDown}
              placeholder={searchPlaceholder}
              className="border rounded px-3 py-2 mr-2 focus:outline-blue-950 "
            />
            <Button
              onClick={handleSearch}
              className="font-semibold bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded h-[44px]"
            >
              Tìm kiếm
            </Button>
          </div>
        )}
      </div>
      {desc && (
        <div className="px-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
        </div>
      )}

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>

      {/* Modal */}
      {useModal && modalContent && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setInternalIsModalOpen(false);
            if (modalClose) modalClose();
          }}
          className={modalStyle}
        >
          {modalContent}
        </Modal>
      )}
    </div>
  );
};

export default TableComponentCard;
