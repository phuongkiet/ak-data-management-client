import { useState } from "react";
import { observer } from "mobx-react-lite";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from "../../../app/stores/store.ts";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import FactoryTableComponent from "../../../components/tables/factory/FactoryTableComponent.tsx";
import ProductLabel from "../../../components/form/product-form/ProductLabel.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import ReactSelect from "react-select";
import { useApi } from "../../../hooks/useApi.ts";
import { useTheme } from "../../../app/context/ThemeContext.tsx";

const FactoryTable = () => {
  const { theme } = useTheme();
  const { factoryStore, supplierStore } = useStore();
  const { productFactoryList, loading } = factoryStore;
  const { isOnline } = useApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rawFactoryName, setRawFactoryName] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleFactoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setRawFactoryName(inputValue);
    const supplierName = selectedSupplier?.label || "";
    const name = supplierName ? `${supplierName}/${inputValue}` : inputValue;
    factoryStore.updateFactoryForm("name", name);
  };

  // useEffect(() => {
  //   if (isOnline) {
  //     loadFactories();
  //   }
  // }, [isOnline]);

  const handleSubmit = async () => {
    const result = await factoryStore.addFactory();
    if (result) {
      handleModalClose();
    }
  };

  // Lọc supplierList: chỉ lấy supplierShortCode kết thúc bằng 'F' (không tính số cuối)
  const filteredSuppliers = supplierStore.productSupplierList.filter((sup) => {
    // Lấy supplierShortCode, loại số cuối nếu có
    const code = sup.supplierShortCode || "";
    // Loại số cuối nếu có
    const codeNoNumber = code.replace(/\d+$/, "");
    return codeNoNumber.endsWith("F");
  });
  const supplierOptions = filteredSuppliers.map((sup) => ({
    value: sup.id,
    label: sup.supplierName,
  }));

  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là bảng nhà máy của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Nhà máy" />
      <div className="space-y-6">
        <TableComponentCard
          title="Bảng nhà máy"
          addButtonLink={"add-factory"}
          addButtonText={"Tạo nhà máy"}
          useModal={true}
          isModalOpen={isModalOpen}
          modalClose={handleModalClose}
          onModalOpen={handleModalOpen}
          modalStyle="w-full max-w-4xl rounded-3xl space-y-4 p-6"
          className="text-white"
          modalContent={
            <div>
              <h1 className="text-2xl font-bold mb-2 text-black">Tạo nhà máy</h1>
              <div className="grid grid-cols-2 gap-4 space-y-2">
                <div className="col-span-2">
                  <ProductLabel>Mã nhà máy</ProductLabel>
                  <ReactSelect
                    options={supplierOptions}
                    placeholder="Chọn nhà cung cấp"
                    onChange={opt => {
                      setSelectedSupplier(opt);
                      const supplierName = opt?.label || "";
                      const name = supplierName && rawFactoryName ? `${supplierName}/${rawFactoryName}` : rawFactoryName;
                      factoryStore.updateFactoryForm("name", name);
                    }}
                    isClearable
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
                        backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
                        color: theme === 'dark' ? '#fff' : base.color,
                        borderColor: theme === 'dark' ? '#384052' : base.borderColor,
                        border: theme === 'dark' ? '1px solid #384052' : '1px solid #e5e7eb',
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        height: "44px",
                        padding: "0 8px",
                        backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
                        color: theme === 'dark' ? '#fff' : base.color,
                      }),
                      indicatorsContainer: (base) => ({
                        ...base,
                        height: "44px",
                        backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
                      }),
                      option: (base, state) => ({
                        ...base,
                        fontFamily: "Roboto, sans-serif",
                        backgroundColor: state.isFocused
                          ? (theme === 'dark' ? '#23232b' : '#f3f4f6')
                          : (theme === 'dark' ? '#131827' : 'white'),
                        color: theme === 'dark' ? '#fff' : 'black',
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
                        color: theme === 'dark' ? '#fff' : base.color,
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: theme === 'dark' ? '#fff' : base.color,
                      }),
                      input: (base) => ({
                        ...base,
                        color: theme === 'dark' ? '#fff' : base.color,
                      }),
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <ProductLabel>Tên nhà máy</ProductLabel>
                  <Input
                    placeholder="Nhập tên nhà máy"
                    value={rawFactoryName}
                    onChange={handleFactoryNameChange}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-lg bg-[#334355] px-6 py-2.5 text-center text-sm font-bold text-white hover:bg-[#334355] focus:outline-none focus:ring-2 focus:ring-[#334355]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    "Tạo nhà máy"
                  )}
                </Button>
              </div>
            </div>
          }
          onSearch={(term) => {
            factoryStore.setTerm(term);
          }}
          isOnline={isOnline}
        >
          <FactoryTableComponent
            data={productFactoryList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productFactoryList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(FactoryTable);
