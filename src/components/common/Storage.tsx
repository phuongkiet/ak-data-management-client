import DataTable, { TableColumn } from "react-data-table-component";
import { BoxIconLine } from "../../icons";
import { useEffect, useState } from "react";
import { useStore } from "../../app/stores/store";
import Modal from "../ui/modal/index.tsx";
import ProductLabel from "../form/product-form/ProductLabel.tsx";
import Button from "../ui/button/Button.tsx";
import ProductInputField from "../form/product-form/input/product/ProductInputField.tsx";
import { observer } from "mobx-react-lite";
import { LinkStorageDto } from "../../app/models/storage/linkStorage.model";
import { useTheme } from "../../app/context/ThemeContext.tsx";
import { CiEdit, CiTrash } from "react-icons/ci";
import { Tooltip } from "react-tooltip";

const Storage = () => {
  const { userStore, linkStorageStore } = useStore();
  const { user } = userStore;
  const isAdmin = user?.role.includes("Admin") || user?.role.includes("Strategist");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [selectedId, setSelectedId] = useState(0);
  const [addName, setAddName] = useState("");
  const [addUrl, setAddUrl] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    linkStorageStore.loadLinkStorages();
  }, []);

  const handleEdit = (item: LinkStorageDto) => {
    setEditName(item.name);
    setEditUrl(item.url);
    setSelectedId(item.id);
    linkStorageStore.updateLinkStorageFormUpdate("name", item.name);
    linkStorageStore.updateLinkStorageFormUpdate("url", item.url);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await linkStorageStore.updateLinkStorage(selectedId);
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    setAddName("");
    setAddUrl("");
    linkStorageStore.resetLinkStorageForm();
    setIsAddModalOpen(true);
  };

  const handleAddSave = async () => {
    linkStorageStore.updateLinkStorageForm("name", addName);
    linkStorageStore.updateLinkStorageForm("url", addUrl);
    await linkStorageStore.addLinkStorage();
    setIsAddModalOpen(false);
  };

  const handleDelete = async (row: LinkStorageDto) => {
    const success = await linkStorageStore.deleteLinkStorage(row.id);
    if (success) {
      setIsModalOpen(false);
      setSelectedId(0);
    }
  };

  const columns: TableColumn<any>[] = [
    {
      name: "Tên",
      selector: (row) => row.name,
      cell: (row) => (
        <a
          href={row.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-medium dark:text-white dark:hover:underline"
        >
          {row.name}
        </a>
      ),
    },
    {
      name: "Địa chỉ",
      selector: (row) => row.url,
      cell: (row) => (
        <a
          href={row.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-medium dark:text-white dark:hover:underline"
        >
          {row.url.slice(0, 45)}...
        </a>
      ),
    },
  ];

  const adminColumns: TableColumn<any>[] = [
    {
      name: "Tên",
      selector: (row) => row.name,
      cell: (row) => (
        <a
          href={row.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-medium dark:text-white dark:hover:underline"
        >
          {row.name}
        </a>
      ),
    },
    {
      name: "Địa chỉ",
      selector: (row) => row.url,
      cell: (row) => (
        <a
          href={row.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-medium dark:text-white dark:hover:underline"
        >
          {row.url.slice(0, 45)}...
        </a>
      ),
    },
    {
      name: "Hành động",
      cell: (row) => {
        return (
          <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:underline font-medium dark:text-white"
            data-tooltip-id="edit-tooltip"
            data-tooltip-content="Chỉnh sửa"
          >
            <CiEdit className="w-6 h-6 hover:opacity-50" />
            <Tooltip id="edit-tooltip" className="text-md" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:underline font-medium dark:text-white"
            data-tooltip-id="delete-tooltip"
            data-tooltip-content="Xóa"
          >
            <CiTrash className="w-6 h-6 hover:opacity-50" />
            <Tooltip id="delete-tooltip" className="text-md" />
          </button>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <span className="text-lg text-[#334355] dark:text-white font-bold">Kho đồ</span>
        <div className="ml-auto">
          <Button
            className="px-4 py-2 bg-[#334355] text-white rounded h-[36px] text-md font-semibold"
            onClick={handleAdd}
          >
            Thêm kho
          </Button>
        </div>
      </div>

      <div className="w-full mt-5">
        <div>
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
            <DataTable
              columns={isAdmin ? adminColumns : columns}
              data={linkStorageStore.linkStorageList}
              responsive
              highlightOnHover
              striped
              selectableRows
              onSelectedRowsChange={() => {}}
              theme={theme === "dark" ? "customDark" : "default"}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="max-w-xl"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
            <h2 className="text-lg font-bold mb-4">Chỉnh sửa kho</h2>
            <div className="mb-3">
              <ProductLabel className="block mb-1 font-medium">
                Tên
              </ProductLabel>
              <ProductInputField
                value={editName}
                placeholder="Nhập tên kho đồ"
                onChange={(e) => {
                  setEditName(e.target.value);
                  linkStorageStore.updateLinkStorageFormUpdate(
                    "name",
                    e.target.value
                  );
                }}
              />
            </div>
            <div className="mb-3">
              <ProductLabel className="block mb-1 font-medium">
                URL
              </ProductLabel>
              <ProductInputField
                value={editUrl}
                placeholder="Nhập URL kho đồ"
                onChange={(e) => {
                  setEditUrl(e.target.value);
                  linkStorageStore.updateLinkStorageFormUpdate(
                    "url",
                    e.target.value
                  );
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                className="px-4 py-2 bg-[#334355] rounded text-white h-[44px] text-md font-semibold"
                onClick={() => setIsModalOpen(false)}
                disabled={linkStorageStore.loading}
              >
                Hủy
              </Button>
              <Button
                className="px-4 py-2 bg-[#334355] text-white rounded h-[44px] text-md font-semibold"
                onClick={handleSave}
                disabled={linkStorageStore.loading}
              >
                {linkStorageStore.loading ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          className="max-w-xl"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
            <h2 className="text-lg font-bold mb-4">Thêm kho mới</h2>
            <div className="mb-3">
              <ProductLabel className="block mb-1 font-medium">
                Tên
              </ProductLabel>
              <ProductInputField
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="Nhập tên kho đồ"
              />
            </div>
            <div className="mb-3">
              <ProductLabel className="block mb-1 font-medium">
                URL
              </ProductLabel>
              <ProductInputField
                value={addUrl}
                onChange={(e) => setAddUrl(e.target.value)}
                placeholder="Nhập URL kho đồ"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                className="px-4 py-2 bg-[#334355] rounded text-white h-[44px] text-md font-semibold"
                onClick={() => setIsAddModalOpen(false)}
                disabled={linkStorageStore.loading}
              >
                Hủy
              </Button>
              <Button
                className="px-4 py-2 bg-[#334355] text-white rounded h-[44px] text-md font-semibold"
                onClick={handleAddSave}
                disabled={linkStorageStore.loading}
              >
                {linkStorageStore.loading ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default observer(Storage);
