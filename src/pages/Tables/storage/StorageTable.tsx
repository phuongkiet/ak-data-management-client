import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from "../../../app/stores/store.ts";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import StorageTableComponent from "../../../components/tables/storage/StorageTableComponent.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import ProductLabel from "../../../components/form/product-form/ProductLabel.tsx";

function StorageTable() {
  const { storageStore } = useStore();
  const { loadStorages, productStorageList, loading } = storageStore;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  useEffect(() => {
    loadStorages();
  }, []);

  const handleSubmit = async () => {
    const result = await storageStore.addStorage();
    if (result) {
      handleModalClose();
    }
  };

  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là bảng kho hàng của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Hình thức giao hàng" />
      <div className="space-y-6">
        <TableComponentCard
          title="Bảng hình thức giao hàng"
          addButtonLink={"add-storage"}
          addButtonText={"Tạo hình thức giao hàng"}
          useModal={true}
          isModalOpen={isModalOpen}
          modalClose={handleModalClose}
          onModalOpen={handleModalOpen}
          modalStyle="w-full max-w-4xl rounded-3xl space-y-4 p-6"
          modalContent={
            <div>
              <h1 className="text-2xl font-bold mb-2">Tạo chất liệu</h1>
              <div className="grid grid-cols-2 gap-4 space-y-2">
                <div className="col-span-2">
                  <ProductLabel>Tên kho</ProductLabel>
                  <Input
                    placeholder="Nhập tên kho"
                    value={storageStore.storageForm.name}
                    onChange={(e) =>
                      storageStore.updateStorageForm("name", e.target.value)
                    }
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
                    "Tạo kho"
                  )}
                </Button>
              </div>
            </div>
          }
        >
          <StorageTableComponent
            data={productStorageList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productStorageList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(StorageTable);
