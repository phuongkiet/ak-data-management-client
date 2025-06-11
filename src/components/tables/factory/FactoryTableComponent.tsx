import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { ProductFactoryDto } from "../../../app/models/product/productFactory.model.ts";
import { useStore } from "../../../app/stores/store.ts";
import { observer } from "mobx-react-lite";
import Button from "../../ui/button/Button.tsx";
import Modal from "../../ui/modal/index.tsx";
import ProductLabel from "../../form/product-form/ProductLabel.tsx";
import ProductInputField from "../../form/product-form/input/product/ProductInputField.tsx";
import ReactSelect from "react-select";

interface FactoryTableComponentProps {
  data: ProductFactoryDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

const FactoryTableComponent = ({ data }: FactoryTableComponentProps) => {
  const { factoryStore, supplierStore } = useStore();
  const { loading } = factoryStore;
  const [selectedProducts, setSelectedProducts] = useState<ProductFactoryDto[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProductFactoryDto | null>(
    null
  );
  const [selectedSupplier, setSelectedSupplier] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [factoryName, setFactoryName] = useState("");

  const filteredSuppliers = supplierStore.productSupplierList.filter((sup) => {
    const code = sup.supplierShortCode || "";
    const codeNoNumber = code.replace(/\d+$/, "");
    return codeNoNumber.endsWith("F");
  });
  const supplierOptions = filteredSuppliers.map((sup) => ({
    value: sup.supplierName,
    label: sup.supplierName,
  }));

  const handleView = (factory: ProductFactoryDto) => {
    setSelectedItem(factory);
    const [sup, ...rest] = (factory.name || "").split("/");
    if (rest.length > 0) {
      setSelectedSupplier({ value: sup, label: sup });
      setFactoryName(rest.join("/"));
      factoryStore.updateFactoryFormUpdate("name", factory.name);
    } else {
      setSelectedSupplier(null);
      setFactoryName(sup);
      factoryStore.updateFactoryFormUpdate("name", factory.name);
    }
    setIsModalOpen(true);
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductFactoryDto[];
  }) => {
    setSelectedProducts(state.selectedRows);
    console.log("Selected Factories:", state.selectedRows);
    console.log(selectedProducts);
  };

  const columns: TableColumn<ProductFactoryDto>[] = [
    {
      name: "STT",
      selector: (row) => row.id,
      sortable: true,
      maxWidth: "5px",
    },
    {
      name: "Tên",
      selector: (row) => row.name,
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

  const handleSave = async () => {
    if (selectedItem) {
      const success = await factoryStore.updateFactory(selectedItem.id);
      if (success) {
        setIsModalOpen(false);
        setSelectedItem(null);
      } else {
        setIsModalOpen(false);
        setSelectedItem(null);
      }
    }
  };

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
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Chi tiết nhà máy
          </h2>
          <div className="space-y-4">
            <div>
              <ProductLabel className="block text-sm font-medium mb-1">
                Nhà cung cấp
              </ProductLabel>
              <ReactSelect
                options={supplierOptions}
                value={selectedSupplier}
                onChange={(opt) => {
                  setSelectedSupplier(opt);
                  const newName = opt
                    ? `${opt.value}/${factoryName}`
                    : factoryName;
                  factoryStore.updateFactoryFormUpdate("name", newName);
                }}
                isClearable
                placeholder="Chọn nhà cung cấp"
                className="react-select-container"
                classNamePrefix="react-select"
                isLoading={loading}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "44px",
                    height: "44px",
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "14px",
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
            <div>
              <ProductLabel className="block text-sm font-medium mb-1">
                Tên nhà máy
              </ProductLabel>
              <ProductInputField
                value={factoryName}
                onChange={(e) => {
                  setFactoryName(e.target.value);
                  const newName = selectedSupplier
                    ? `${selectedSupplier.value}/${e.target.value}`
                    : e.target.value;
                  factoryStore.updateFactoryFormUpdate("name", newName);
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
export default observer(FactoryTableComponent);
