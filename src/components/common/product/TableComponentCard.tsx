import { useStore } from "../../../app/stores/store.ts";
import Button from "../../ui/button/Button.tsx";
import { useNavigate } from "react-router";
import { useState } from "react";
import Modal from "../../ui/modal";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  addButtonLink?: string;
  addButtonText?: string;
  addButtonStyle?: string;
  modalContent?: React.ReactNode;
  modalClose?: () => void;
  onModalOpen?: () => void;
  modalStyle?: string;
  useModal?: boolean;
  isModalOpen?: boolean;
  additionalButtons?: React.ReactNode;
  onSearch?: (term: string) => void;
  searchPlaceholder?: string;
  searchTerm?: string;
  onPageSizeChange?: (newPageSize: number) => void;
  pageSize?: number;
  totalCount?: number;
  loading?: boolean;
  isOnline?: boolean;
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
  searchTerm,
  isOnline
}) => {
  const [internalIsModalOpen, setInternalIsModalOpen] = useState(false);
  const isModalOpen = externalIsModalOpen !== undefined ? externalIsModalOpen : internalIsModalOpen;
  const navigate = useNavigate();
  const { productStore } = useStore();

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
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-6 py-5 gap-2 md:gap-0">
        <div className="flex items-center gap-2 md:gap-0">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          <div className="hidden md:inline-flex items-center">
            {addButtonLink && (
              <Button
                type="button"
                onClick={handleAddClick}
                className={addButtonStyle || "ml-4 h-8 py-5 font-semibold rounded bg-sky-700 hover:bg-sky-800"}
              >
                {addButtonText}
              </Button>
            )}
            {additionalButtons}
          </div>
          <div className="inline-flex md:hidden items-center gap-2 ml-2">
            {addButtonLink && (
              <div
                onClick={handleAddClick}
                className={`bg-sky-700 hover:bg-sky-800 text-white rounded-lg flex items-center justify-center ${!isOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ width: 35, height: 35, cursor: "pointer" }}
                aria-label="Thêm mới"
              >
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            )}
            {additionalButtons}
          </div>
        </div>
        {onSearch && (
          <div className="w-full md:w-auto flex items-center mt-2 md:mt-0">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              placeholder={searchPlaceholder}
              className="border rounded px-3 py-2 mr-2 focus:outline-blue-950 w-full md:w-auto text-black"
              disabled={!isOnline}
            />
            <Button
              onClick={() => onSearch(searchTerm || '')}
              className="font-semibold bg-sky-700 hover:bg-sky-800 text-white px-3 py-2 rounded h-[40px] w-10 md:w-auto flex items-center justify-center"
              aria-label="Tìm kiếm"
              disabled={!isOnline}
            >
              <span className="md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="currentColor"
                    strokeWidth={2}
                    fill="none"
                  />
                  <line
                    x1="21"
                    y1="21"
                    x2="16.65"
                    y2="16.65"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="hidden md:inline">Tìm kiếm</span>
            </Button>
          </div>
        )}
      </div>
      {desc && (
        <div className="px-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
        </div>
      )}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
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
