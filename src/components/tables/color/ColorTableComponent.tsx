import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { ProductColorDto } from "../../../app/models/product/productColor.model.ts";
import { useStore } from "../../../app/stores/store.ts";
import { observer } from "mobx-react-lite";
import Modal from "../../ui/modal/index.tsx";
import Button from "../../ui/button/Button.tsx";
import ProductLabel from "../../form/product-form/ProductLabel.tsx";
import ProductInputField from "../../form/product-form/input/product/ProductInputField.tsx";
import { ChromePicker } from 'react-color';
import { useTheme } from "../../../app/context/ThemeContext.tsx";
import { FaEye } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { CiTrash } from "react-icons/ci";

interface ColorTableComponentProps {
  data: ProductColorDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

const ColorTableComponent = ({ data }: ColorTableComponentProps) => {
  const { colorStore } = useStore();
  const { loading } = colorStore;
  const [selectedProducts, setSelectedProducts] = useState<ProductColorDto[]>(
    []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProductColorDto | null>(
    null
  );
  const { theme } = useTheme();
  const handleView = (color: ProductColorDto) => {
    setSelectedItem(color);
    colorStore.updateColorFormUpdate("name", color.name);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (selectedItem) {
      const success = await colorStore.updateColor(selectedItem.id);
      if (success) {
        setIsModalOpen(false);
        setSelectedItem(null);
      }else{
        setIsModalOpen(false);
        setSelectedItem(null);
      }
    }
  }

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductColorDto[];
  }) => {
    setSelectedProducts(state.selectedRows);
    console.log("Selected Colors:", state.selectedRows);
    console.log(selectedProducts);
  };

  const handleDelete = async (row: ProductColorDto) => {
    const success = await colorStore.deleteColor(row.id);
    if (success) {
      setIsModalOpen(false);
      setSelectedItem(null);
    }
  };

  const columns: TableColumn<ProductColorDto>[] = [
    {
      name: "STT",
      selector: (row) => row.id,
      sortable: true,
      maxWidth: "5px",
    },
    {
      name: "Màu",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Mã màu",
      selector: (row) => row.colorHexCode || "Không tìm thấy",
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
          theme={theme === 'dark' ? 'customDark' : 'default'}
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
            Chi tiết màu sắc
          </h2>
          <div className="flex justify-center items-center gap-8">
            {/* Left: Labels and Inputs */}
            <div className="flex flex-col gap-4 w-1/2">
              <div>
                <ProductLabel className="block text-sm font-medium mb-1">
                  Tên màu sắc
                </ProductLabel>
                <ProductInputField
                  value={colorStore.colorFormUpdate.name}
                  onChange={(e) =>
                    colorStore.updateColorFormUpdate(
                      "name",
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <ProductLabel className="block text-sm font-medium mb-1">
                  Mã màu sắc
                </ProductLabel>
              </div>
              <div className="h-11 w-full rounded-lg border mt-2" style={{ background: colorStore.colorFormUpdate.colorHexCode || "#ffffff" }} />
            </div>
            {/* Right: ChromePicker */}
            <div className="flex justify-center items-center w-1/2">
              <ChromePicker
                color={colorStore.colorFormUpdate.colorHexCode || "#ffffff"}
                onChangeComplete={(color) =>
                  colorStore.updateColorFormUpdate("colorHexCode", color.hex)
                }
                disableAlpha
              />
            </div>
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
      </Modal>
    </>
  );
};
export default observer(ColorTableComponent);
