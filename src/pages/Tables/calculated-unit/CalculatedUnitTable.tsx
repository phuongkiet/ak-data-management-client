import { useState } from "react";
import { observer } from "mobx-react-lite";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from "../../../app/stores/store.ts";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import ProductLabel from "../../../components/form/product-form/ProductLabel.tsx";
import { useApi } from "../../../hooks/useApi.ts";
import CalculatedUnitTableComponent from "../../../components/tables/calculated-unit/CalculatedUnitTableComponent.tsx";
import ProductInputField from "../../../components/form/product-form/input/product/ProductInputField.tsx";

function CalculatedUnitTable() {
  const { calculatedUnitStore } = useStore();
  const { productCalculatedUnitList, loading } = calculatedUnitStore;
  const { isOnline } = useApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  // useEffect(() => {
  //   if (isOnline) {
  //     loadBodyColors();
  //   }
  // }, [isOnline]);

  const handleSubmit = async () => {
    const result = await calculatedUnitStore.addCalculatedUnit();
    if (result) {
      handleModalClose();
    }
  };

  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là bảng đơn vị tính của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Đơn vị tính" />
      <div className="space-y-6">
        <TableComponentCard
          title="Bảng đơn vị tính"
          addButtonLink={"add-calculated-unit"}
          addButtonText={"Tạo đơn vị tính"}
          useModal={true}
          isModalOpen={isModalOpen}
          modalClose={handleModalClose}
          onModalOpen={handleModalOpen}
          modalStyle="w-full max-w-lg rounded-3xl space-y-4 p-6"
          className="text-white"
          modalContent={
            <div>
              <h1 className="text-2xl font-bold mb-2 text-black">Tạo đơn vị tính</h1>
              <div className="grid grid-cols-2 gap-4 space-y-2">
                <div className="col-span-2">
                  <ProductLabel>Tên đơn vị tính</ProductLabel>
                  <ProductInputField
                    name="calculatedUnitName"
                    type="text"
                    placeholder="Nhập đơn vị tính"
                    value={calculatedUnitStore.calculatedUnitForm.calculatedUnitName.toUpperCase()}
                    onChange={(e) => calculatedUnitStore.updateCalculatedUnitForm('calculatedUnitName', e.target.value)}
                    onBlur={() => {}}
                  />
                </div>
                <div className="col-span-2">
                  <ProductLabel>Tên đơn vị tính tự động</ProductLabel>
                  <ProductInputField
                    name="autoCalculatedUnitName"
                    type="text"
                    placeholder="Nhập đơn vị tính tự động"
                    value={calculatedUnitStore.calculatedUnitForm.autoCalculatedUnitName.toUpperCase()}
                    onChange={(e) => calculatedUnitStore.updateCalculatedUnitForm('autoCalculatedUnitName', e.target.value)}
                    onBlur={() => {}}
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
                    "Tạo đơn vị tính"
                  )}
                </Button>
              </div>
            </div>
          }
          onSearch={(term) => {
            calculatedUnitStore.setTerm(term);
          }}
          isOnline={isOnline}
        >
          <CalculatedUnitTableComponent
            data={productCalculatedUnitList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productCalculatedUnitList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(CalculatedUnitTable);
