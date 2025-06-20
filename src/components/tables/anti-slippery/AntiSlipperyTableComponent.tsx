import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { ProductAntiSlipperyDto } from "../../../app/models/product/productAntiSlippery.model.ts";
import { useStore } from "../../../app/stores/store.ts";
import Modal from "../../ui/modal";
import ProductLabel from "../../form/product-form/ProductLabel.tsx";
import ProductInputField from "../../form/product-form/input/product/ProductInputField.tsx";
import ProductTextArea from "../../form/product-form/input/product/ProductTextArea.tsx";
import Button from "../../ui/button/Button.tsx";
import { observer } from "mobx-react-lite";
import { useTheme } from "../../../app/context/ThemeContext.tsx";
import { FaEye } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { Tooltip } from "react-tooltip";

interface AntiSlipperyTableComponentProps {
  data: ProductAntiSlipperyDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

const AntiSlipperyTableComponent = ({
  data,
}: AntiSlipperyTableComponentProps) => {
  const { antiSlipperyStore } = useStore();
  const { loading } = antiSlipperyStore;
  const [selectedProducts, setSelectedProducts] = useState<
    ProductAntiSlipperyDto[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<ProductAntiSlipperyDto | null>(null);
  const { theme } = useTheme();
  const handleView = (antiSlip: ProductAntiSlipperyDto) => {
    setSelectedItem(antiSlip);
    antiSlipperyStore.updateAntiSlipperyFormUpdate(
      "antiSlipLevel",
      antiSlip.antiSlipLevel
    );
    antiSlipperyStore.updateAntiSlipperyFormUpdate(
      "description",
      antiSlip.description
    );
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (selectedItem) {
      const success = await antiSlipperyStore.updateAntiSlippery(
        selectedItem.id
      );
      if (success) {
        setIsModalOpen(false);
        setSelectedItem(null);
      } else {
        setIsModalOpen(false);
        setSelectedItem(null);
      }
    }
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductAntiSlipperyDto[];
  }) => {
    setSelectedProducts(state.selectedRows);
    console.log("Selected Anti Slippery:", state.selectedRows);
    console.log(selectedProducts);
  };

  const handleDelete = async (row: ProductAntiSlipperyDto) => {
    const success = await antiSlipperyStore.deleteAntiSlippery(row.id);
    if (success) {
      setIsModalOpen(false);
      setSelectedItem(null);
    }
  };

  const columns: TableColumn<ProductAntiSlipperyDto>[] = [
    {
      name: "STT",
      selector: (row) => row.id,
      sortable: true,
      maxWidth: "5px",
    },
    {
      name: "Mức độ chống trượt",
      selector: (row) => row.antiSlipLevel,
      sortable: true,
    },
    {
      name: "Mô tả",
      selector: (row) => (row.description ? row.description : "Không có mô tả"),
      sortable: true,
    },
    {
      name: "Hành động",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(row)}
            className="text-blue-600 hover:underline font-medium"
            data-tooltip-id="view-tooltip"
            data-tooltip-content="Xem"
          >
            <FaEye className="w-6 h-6 hover:opacity-50" />
            <Tooltip id="view-tooltip" className="text-md" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:underline font-medium"
            data-tooltip-id="delete-tooltip"
            data-tooltip-content="Xóa"
          >
            <CiTrash className="w-6 h-6 hover:opacity-50" />
            <Tooltip id="delete-tooltip" className="text-md" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
        <DataTable
          theme={theme === "dark" ? "customDark" : "default"}
          columns={columns}
          data={data}
          pagination
          responsive
          highlightOnHover
          striped
          selectableRows
          onSelectedRowsChange={handleSelectedRowsChange}
          progressPending={loading}
          progressComponent={
            <div className="py-8 text-center font-semibold font-roboto w-full">
              Đang chờ...
            </div>
          }
          noDataComponent={
            <div className="py-8 text-center font-semibold font-roboto w-full">
              Không có dữ liệu để hiển thị.
            </div>
          }
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-2xl"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Chi tiết độ chống trượt
          </h2>
          <div className="space-y-4">
            <div>
              <ProductLabel className="block text-sm font-medium mb-1">
                Mức độ chống trượt
              </ProductLabel>
              <ProductInputField
                value={antiSlipperyStore.antiSlipperyFormUpdate.antiSlipLevel}
                onChange={(e) =>
                  antiSlipperyStore.updateAntiSlipperyFormUpdate(
                    "antiSlipLevel",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <ProductLabel className="block text-sm font-medium mb-1">
                Mô tả
              </ProductLabel>
              <ProductTextArea
                value={
                  antiSlipperyStore.antiSlipperyFormUpdate.description || ""
                }
                onChange={(e) =>
                  antiSlipperyStore.updateAntiSlipperyFormUpdate(
                    "description",
                    e.target.value
                  )
                }
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg bg-[#334357] text-white hover:bg-[#334357]/80 h-[44px] text-md font-semibold"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                className="px-4 py-2 bg-[#334357] text-white rounded-lg hover:bg-[#334357]/80 h-[44px] text-md font-semibold"
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default observer(AntiSlipperyTableComponent);
