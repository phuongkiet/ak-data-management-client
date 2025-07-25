import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from "../../../app/stores/store.ts";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import BodyColorTableComponent from "../../../components/tables/body-color/BodyColorTableComponent.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import ProductLabel from "../../../components/form/product-form/ProductLabel.tsx";
import { useApi } from "../../../hooks/useApi.ts";

function BodyColorTable() {
  const { bodyColorStore } = useStore();
  const { displayList, loading, loadAllBodyColors } = bodyColorStore;
  const { isOnline } = useApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOnline) {
      loadAllBodyColors();
    }
  }, [isOnline]);

  // Cleanup effect khi rời khỏi trang
  useEffect(() => {
    return () => {
      // Reset search và load lại list đầy đủ khi rời khỏi trang
      bodyColorStore.clearSearch();
      if (isOnline) {
        bodyColorStore.loadAllBodyColors();
      }
    };
  }, []);

  const handleSubmit = async () => {
    const result = await bodyColorStore.addBodyColor();
    if (result) {
      handleModalClose();
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    bodyColorStore.setTerm(term);
  };

  const handleSearchSubmit = async () => {
    await bodyColorStore.searchBodyColor();
  };

  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là bảng màu sắc thân gạch của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Màu thân gạch" />
      <div className="space-y-6">
        <TableComponentCard
          title="Bảng màu thân gạch"
          addButtonLink={"add-body-color"}
          addButtonText={"Tạo màu thân gạch"}
          useModal={true}
          isModalOpen={isModalOpen}
          modalClose={handleModalClose}
          onModalOpen={handleModalOpen}
          modalStyle="w-full max-w-lg rounded-3xl space-y-4 p-6"
          className="text-white"
          modalContent={
            <div>
              <h1 className="text-2xl font-bold mb-2 text-black">Tạo màu thân gạch</h1>
              <div className="grid grid-cols-2 gap-4 space-y-2">
                <div className="col-span-2">
                  <ProductLabel>Tên màu thân gạch</ProductLabel>
                  <Input
                    placeholder="Nhập tên màu thân gạch"
                    value={bodyColorStore.bodyColorForm.name}
                    onChange={(e) =>
                      bodyColorStore.updateBodyColorForm("name", e.target.value.toUpperCase())
                    }
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
                    "Tạo màu thân gạch"
                  )}
                </Button>
              </div>
            </div>
          }
          onSearch={(term) => {
            handleSearch(term);
          }}
          onSearchSubmit={handleSearchSubmit}
          isOnline={isOnline}
        >
          <BodyColorTableComponent
            data={displayList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            totalCount={displayList.length}
            searchTerm={searchTerm}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(BodyColorTable);
