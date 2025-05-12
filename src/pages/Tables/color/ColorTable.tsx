import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from "../../../app/stores/store.ts";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import ColorTableComponent from "../../../components/tables/color/ColorTableComponent.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import ProductLabel from "../../../components/form/product-form/ProductLabel.tsx";
import { ChromePicker } from "react-color";
function ColorTable() {
  const { colorStore } = useStore();
  const { loadColors, productColorList, loading } = colorStore;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  useEffect(() => {
    loadColors();
  }, []);

  const handleSubmit = async () => {
    const result = await colorStore.addColor();
    if (result) {
      handleModalClose();
    }
  };

  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là bảng màu sắc của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Màu sắc" />
      <div className="space-y-6">
        <TableComponentCard
          title="Bảng màu sắc"
          addButtonLink={"add-color"}
          addButtonText={"Tạo màu sắc"}
          useModal={true}
          isModalOpen={isModalOpen}
          modalClose={handleModalClose}
          onModalOpen={handleModalOpen}
          modalStyle="w-full max-w-4xl rounded-3xl space-y-4 p-6"
          modalContent={
            <div>
              <h1 className="text-2xl font-bold mb-2">Tạo màu sắc</h1>
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <ProductLabel>Tên màu sắc</ProductLabel>
                      <Input
                        placeholder="Nhập tên màu sắc"
                        value={colorStore.colorForm.name}
                        onChange={(e) =>
                          colorStore.updateColorForm("name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <ProductLabel>Mã màu sắc</ProductLabel>
                      <div
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                        style={{
                          background:
                            colorStore.colorForm.colorHexCode || "#ffffff",
                        }}
                      />
                    </div>
                    <div>
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
                          "Tạo màu sắc"
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <ChromePicker
                      color={colorStore.colorForm.colorHexCode || "#ffffff"}
                      onChangeComplete={(color) =>
                        colorStore.updateColorForm("colorHexCode", color.hex)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          }
          onSearch={(term) => {
            colorStore.setTerm(term);
          }}
        >
          <ColorTableComponent
            data={productColorList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productColorList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(ColorTable);
