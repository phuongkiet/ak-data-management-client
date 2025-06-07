import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from "../../../app/stores/store.ts";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import OriginTableComponent from "../../../components/tables/origin/OriginTableComponent.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import ProductLabel from "../../../components/form/product-form/ProductLabel.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import { useApi } from "../../../hooks/useApi.ts";

function OriginTable() {
  const { originStore } = useStore();
  const { loadOrigins, productOriginList, loading } = originStore;
  const { isOnline } = useApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  useEffect(() => {
    if (isOnline) {
      loadOrigins();
    }
  }, [isOnline]);

  const handleSubmit = async () => {
    const result = await originStore.addOrigin();
    if (result) {
      handleModalClose();
    }
  };

  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là bảng xuất xứ của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Xuất xứ" />
      <div className="space-y-6">
        <TableComponentCard
          title="Bảng xuất xứ"
          addButtonLink={"add-origin"}
          addButtonText={"Tạo xuất xứ"}
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
                  <ProductLabel>Tên xuất xứ</ProductLabel>
                  <Input
                    placeholder="Nhập tên xuất xứ"
                    value={originStore.originForm.name}
                    onChange={(e) =>
                      originStore.updateOriginForm("name", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-2">
                  <ProductLabel>Mã xuất xứ</ProductLabel>
                  <Input
                    placeholder="Nhập mã xuất xứ"
                    value={originStore.originForm.upperName}
                    onChange={(e) =>
                      originStore.updateOriginForm("upperName", e.target.value)
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
                    "Tạo xuất xứ"
                  )}
                </Button>
              </div>
            </div>
          }
          onSearch={(term) => {
            originStore.setTerm(term);
          }}
        >
          <OriginTableComponent
            data={productOriginList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productOriginList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(OriginTable);
