import { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { ProductSizeDto } from "../../../app/models/product/productSize.model.ts";
import { useStore } from "../../../app/stores/store.ts";
import { observer } from "mobx-react-lite";
import Button from "../../ui/button/Button.tsx";
import Modal from "../../ui/modal/index.tsx";
import ProductLabel from "../../form/product-form/ProductLabel.tsx";
import ProductInputField from "../../form/product-form/input/product/ProductInputField.tsx";
import ReactSelect from "react-select";

interface SizeTableComponentProps {
  data: ProductSizeDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

const SizeTableComponent = ({ data }: SizeTableComponentProps) => {
  const { sizeStore, companyCodeStore } = useStore();
  const { loading } = sizeStore;
  const { productCompanyCodeList } = companyCodeStore;
  const [selectedProducts, setSelectedProducts] = useState<ProductSizeDto[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProductSizeDto | null>(null);

  // Update autoSized in store when length or wide changes
  useEffect(() => {
    if (sizeStore.sizeFormUpdate.length && sizeStore.sizeFormUpdate.wide) {
      const autoSizedValue = sizeStore.sizeFormUpdate.wide + "x" + sizeStore.sizeFormUpdate.length;
      sizeStore.updateSizeFormUpdate("autoSized", autoSizedValue);
    } else {
      sizeStore.updateSizeFormUpdate("autoSized", "");
    }
  }, [sizeStore.sizeFormUpdate.length, sizeStore.sizeFormUpdate.wide]);

  const handleView = (size: ProductSizeDto) => {
    setSelectedItem(size);
    sizeStore.sizeFormUpdate = {
      length: size.length,
      wide: size.wide,
      autoSized: size.autoSized,
      companyCodeId: size.companyCodeId,
    };
    setIsModalOpen(true);
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductSizeDto[];
  }) => {
    setSelectedProducts(state.selectedRows);
    console.log("Selected Sizes:", state.selectedRows);
    console.log(selectedProducts);
  };

  const columns: TableColumn<ProductSizeDto>[] = [
    {
      name: "STT",
      selector: (row) => row.id,
      sortable: true,
      maxWidth: "5px",
    },
    {
      name: "Dài",
      selector: (row) => row.length,
      sortable: true,
    },
    {
      name: "Rộng",
      selector: (row) => row.wide,
      sortable: true,
    },
    {
      name: "Kích cỡ tự động",
      selector: (row) => row.autoSized,
      sortable: true,
    },
    {
      name: "Hành động",
      cell: (row) => (
        <button
          onClick={() => handleView(row)}
          className="text-blue-600 hover:underline font-medium"
        >
          Xem
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const autoSized = () => {
    if (sizeStore.sizeFormUpdate.length && sizeStore.sizeFormUpdate.wide) {
      return sizeStore.sizeFormUpdate.wide + "x" + sizeStore.sizeFormUpdate.length;
    }
    return "";
  }

  const handleSave = async () => {
    if (selectedItem) {
      const success = await sizeStore.updateSize(selectedItem.id);
      if (success) {
        setIsModalOpen(false);
        setSelectedItem(null);
      }else{
        setIsModalOpen(false);
        setSelectedItem(null);
      }
    }
  };

  // Format company codes for ReactSelect
  const companyCodeOptions = productCompanyCodeList.map((code) => ({
    value: code.id,
    label: code.codeName,
  }));

  return (
    <>
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
        <DataTable
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
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
            Chi tiết kích cỡ
          </h2>
          <div className="space-y-4">
            <div>
              <ProductLabel className="block text-sm font-medium mb-1">
                Dài
              </ProductLabel>
              <ProductInputField
                type="number"
                step={0.1}
                min="0"
                value={sizeStore.sizeFormUpdate.length !== undefined && sizeStore.sizeFormUpdate.length !== null ? sizeStore.sizeFormUpdate.length : ""}
                onChange={(e) =>
                  sizeStore.updateSizeFormUpdate("length", Number(e.target.value))
                }
              />
            </div>
            <div>
              <ProductLabel className="block text-sm font-medium mb-1">
                Rộng
              </ProductLabel>
              <ProductInputField
                type="number"
                step={0.1}
                min="0"
                value={sizeStore.sizeFormUpdate.wide !== undefined && sizeStore.sizeFormUpdate.wide !== null ? sizeStore.sizeFormUpdate.wide : ""}
                onChange={(e) =>
                  sizeStore.updateSizeFormUpdate("wide", Number(e.target.value))
                }
              />
            </div>
            <div>
              <ProductLabel className="block text-sm font-medium mb-1">
                Kích cỡ tự động
              </ProductLabel>
              <ProductInputField
                disabled
                value={autoSized()}
              />
            </div>
            <div>
              <ProductLabel className="block text-sm font-medium mb-1">
                Mã công ty
              </ProductLabel>
              <ReactSelect
                placeholder="Chọn mã công ty"
                value={companyCodeOptions.find(
                  (option) => option.value === sizeStore.sizeFormUpdate.companyCodeId
                )}
                onChange={(e: any) =>
                  sizeStore.updateSizeFormUpdate("companyCodeId", e.value)
                }
                options={companyCodeOptions}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "44px",
                    height: "44px",
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "14px",
                    width: "128px",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    height: "44px",
                    padding: "0 8px",
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    height: "44px",
                  }),
                  option: (base, state) => ({
                    ...base,
                    fontFamily: "Roboto, sans-serif",
                    backgroundColor: state.isFocused ? "#f3f4f6" : "white",
                    color: "black",
                  }),
                }}
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
export default observer(SizeTableComponent);
