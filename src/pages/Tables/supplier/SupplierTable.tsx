import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from "../../../app/stores/store.ts";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import SupplierTableComponent from "../../../components/tables/supplier/SupplierTableComponent.tsx";
import ProductLabel from "../../../components/form/product-form/ProductLabel.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Area from "../../../components/form/product-form/area/Area.tsx";
import { runInAction } from "mobx";
import { useApi } from "../../../hooks/useApi";

function SupplierTable() {
  const { supplierStore } = useStore();
  const { isOnline } = useApi();
  const {
    loadSuppliers,
    productSupplierList,
    loading,
    updateSupplierForm,
    addSupplier,
    areaValue,
    orderNumber,
    getOrderNumber,
    resetSupplierForm,
    updateAreaValue,
  } = supplierStore;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerClassification, setCustomerClassification] =
    useState<string>("");
  const [productSupplier, setProductSupplier] = useState<string>("");

  useEffect(() => {
    if (isOnline) {
      loadSuppliers();
    }
  }, [isOnline]);

  useEffect(() => {
    if (customerClassification && areaValue.id) {
      const combinedValue = `${areaValue.shortCode}${customerClassification}`;
      getOrderNumber(combinedValue);
    }
  }, [areaValue.id, areaValue.shortCode, customerClassification]);

  useEffect(() => {
    // Only update if all required values are present
    if (areaValue.shortCode && customerClassification && orderNumber) {
      const shortCode = `${areaValue.shortCode}${customerClassification}${orderNumber}`;
      const supplierName = supplierStore.supplierForm.supplierName;
      
      // Update both fields in a single runInAction to prevent multiple re-renders
      runInAction(() => {
        supplierStore.updateSupplierForm("supplierShortCode", shortCode);
        
        if (supplierName && productSupplier) {
          const codeName = `${supplierName}-${productSupplier}-${shortCode}`;
          supplierStore.updateSupplierForm("supplierCodeName", codeName);
        } else {
          supplierStore.updateSupplierForm("supplierCodeName", "");
        }
      });
    } else {
      runInAction(() => {
        supplierStore.updateSupplierForm("supplierShortCode", "");
        supplierStore.updateSupplierForm("supplierCodeName", "");
      });
    }
  }, [areaValue.shortCode, customerClassification, orderNumber, supplierStore.supplierForm.supplierName, productSupplier]);

  const resetForm = () => {
    setCustomerClassification("");
    setProductSupplier("");
    resetSupplierForm();
    updateAreaValue("id", 0);
    updateAreaValue("areaName", "");
    updateAreaValue("upperName", "");
    updateAreaValue("shortCode", "");
  };

  const handleModalClose = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const result = await addSupplier();
    if (result) {
      handleModalClose();
    }
  };

  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là bảng nhà cung cấp của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Nhà cung cấp" />
      <div className="space-y-6">
        {!isOnline && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Không có kết nối mạng!</strong>
            <span className="block sm:inline"> Vui lòng kiểm tra kết nối mạng của bạn.</span>
          </div>
        )}
        <TableComponentCard
          title="Bảng nhà cung cấp"
          addButtonLink={"add-supplier"}
          addButtonText={"Tạo nhà cung cấp"}
          useModal={true}
          modalStyle="w-full max-w-4xl rounded-3xl space-y-4 p-6"
          modalClose={handleModalClose}
          onModalOpen={handleModalOpen}
          isModalOpen={isModalOpen}
          modalContent={
            <div>
              <h1 className="text-2xl font-bold mb-2">Tạo nhà cung cấp</h1>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <ProductLabel htmlFor="productSupplier">
                      Sản phẩm của nhà cung cấp
                    </ProductLabel>
                    <Input
                      id="productSupplier"
                      name="productSupplier"
                      type="text"
                      placeholder="Nhập sản phẩm của nhà cung cấp"
                      value={productSupplier}
                      onChange={(e) => setProductSupplier(e.target.value.toUpperCase())}
                    />
                  </div>
                  <div>
                    <ProductLabel htmlFor="supplierName">
                      Tên nhà cung cấp
                    </ProductLabel>
                    <Input
                      id="supplierName"
                      name="supplierName"
                      type="text"
                      placeholder="Nhập tên nhà cung cấp"
                      value={supplierStore.supplierForm.supplierName}
                      onChange={(e) =>
                        updateSupplierForm("supplierName", e.target.value.toUpperCase())
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <ProductLabel htmlFor="area">Khu vực</ProductLabel>
                    <Area isCreateMode={true} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <ProductLabel
                        htmlFor="customerClassification"
                        tooltipId="unique-tooltip-id"
                        tooltip="Nhập mã phân loại khách hàng (ví dụ: D, F, C, P)"
                      >
                        Phân loại khách hàng
                      </ProductLabel>
                      <Input
                        id="customerClassification"
                        name="customerClassification"
                        type="text"
                        placeholder="Nhập phân loại khách hàng"
                        value={customerClassification}
                        onChange={(e) =>
                          setCustomerClassification(e.target.value.toUpperCase())
                        }
                        disabled={!areaValue.id}
                      />
                    </div>
                    <div>
                      <ProductLabel htmlFor="orderNumber">
                        Số thứ tự
                      </ProductLabel>
                      <Input
                        id="orderNumber"
                        name="orderNumber"
                        type="text"
                        value={orderNumber}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <ProductLabel htmlFor="supplierShortCode">
                      Mã ngắn nhà cung cấp
                    </ProductLabel>
                    <Input
                      id="supplierShortCode"
                      name="supplierShortCode"
                      type="text"
                      value={supplierStore.supplierForm.supplierShortCode}
                      disabled
                      className="bg-gray-100"
                      onChange={() => {}}
                    />
                  </div>
                  <div>
                    <ProductLabel htmlFor="supplierCodeName">
                      Mã nhà cung cấp
                    </ProductLabel>
                    <Input
                      id="supplierCodeName"
                      name="supplierCodeName"
                      type="text"
                      value={supplierStore.supplierForm.supplierCodeName}
                      disabled
                      className="bg-gray-100"
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
                      "Tạo nhà cung cấp"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          }
          onSearch={(term) => {
            supplierStore.setTerm(term);
          }}
        >
          <SupplierTableComponent
            data={productSupplierList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productSupplierList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(SupplierTable);
