import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from "../../../app/stores/store.ts";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import FactoryTableComponent from "../../../components/tables/factory/FactoryTableComponent.tsx";
import ProductLabel from "../../../components/form/product-form/ProductLabel.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import SupplierSelect from "../../../components/form/product-form/supplier/SupplierSelect.tsx";

function FactoryTable() {
  const { factoryStore, supplierStore } = useStore();
  const { loadFactories, productFactoryList, loading } = factoryStore;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rawFactoryName, setRawFactoryName] = useState("");
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleFactoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setRawFactoryName(inputValue);
    const supplierName = supplierStore.supplierForm.supplierName;
    const name = supplierName ? `${supplierName}/${inputValue}` : inputValue;
    factoryStore.updateFactoryForm("name", name);
  };

  useEffect(() => {
    loadFactories();
  }, []);

  const handleSubmit = async () => {
    const result = await factoryStore.addFactory();
    if (result) {
      handleModalClose();
    }
  };

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
          modalContent={
            <div>
              <h1 className="text-2xl font-bold mb-2">Tạo nhà máy</h1>
              <div className="grid grid-cols-2 gap-4 space-y-2">
                <div className="col-span-2">
                  <ProductLabel>Mã nhà máy</ProductLabel>
                  <SupplierSelect isCreateMode={true} />
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
                  className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-6 py-2.5 text-center text-sm font-bold text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
