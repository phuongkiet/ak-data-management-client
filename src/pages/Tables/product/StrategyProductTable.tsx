import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import StrategyProductTableComponent from "../../../components/tables/product/StrategyProductTableComponent.tsx";
import { useStore } from "../../../app/stores/store.ts";
import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import Modal from "../../../components/ui/modal/index.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import ProductLabel from "../../../components/form/product-form/ProductLabel";
import ProductInputField from "../../../components/form/product-form/input/product/ProductInputField";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import { useApi } from "../../../hooks/useApi";

const StrategyProductTable = () => {
  const { productStore, supplierTaxStore } = useStore();
  const [pageSize, setPageSize] = useState(productStore.pageSize || 10);
  const {
    strategyProductList,
    loadStrategyProducts,
    loading,
    pageNumber,
    setPageNumber,
    setTerm,
    totalCount,
    term,
  } = productStore;
  const { isOnline } = useApi();
  const { productSupplierTaxList } = supplierTaxStore;
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsImporting(true);
      await productStore.updateBatchProduct(file);
      setIsImporting(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    loadStrategyProducts(pageSize, pageNumber, term ?? undefined);
  }, [pageSize, pageNumber, term]);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    productStore.pageSize = newPageSize;
    setPageSize(newPageSize);
    setPageNumber(1); // Reset to first page
  };

  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là bảng tính giá sản phẩm của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Bảng tính giá" />
      <div className="space-y-6">
        <TableComponentCard
          title="Bảng tính giá"
          className="text-white"
          additionalButtons={
            <>
              <div className="hidden md:inline-flex">
                <Button
                  className="ml-2 h-8 py-5 font-semibold rounded bg-sky-700 hover:bg-sky-800 text-white"
                  disabled={selectedIds.length === 0}
                  onClick={() => setIsBulkModalOpen(true)}
                >
                  Cập nhật giá
                </Button>
                <Button
                  className="ml-2 h-8 py-5 font-semibold rounded bg-sky-700 hover:bg-sky-800 text-white md:mr-2"
                  onClick={handleImportClick}
                  disabled={isImporting}
                >
                  {isImporting ? "Đang xử lý..." : "Cập nhật sản phẩm"}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx,.xls"
                  className="hidden"
                />
              </div>
              {/* Mobile: chỉ hiện icon SVG, không dùng Button */}
              <div className="flex md:hidden gap-2">
                <div
                  onClick={selectedIds.length === 0 ? undefined : () => setIsBulkModalOpen(true)}
                  className={`bg-[#334355] hover:bg-[#334355] text-white rounded-lg flex items-center justify-center${selectedIds.length === 0 ? ' opacity-50 cursor-not-allowed' : ''}`}
                  style={{ width: 35, height: 35, cursor: "pointer" }}
                  aria-label="Cập nhật giá"
                >
                  {/* Upload SVG icon */}
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="35.000000pt"
                    height="35.000000pt"
                    viewBox="0 0 35.000000 35.000000"
                    className="h-6 w-6 text-white"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g
                      transform="translate(0.000000,35.000000) scale(0.100000,-0.100000)"
                      fill="#ffffff"
                      stroke="none"
                    >
                      <path
                        d="M125 325 c-22 -8 -52 -28 -67 -44 -31 -35 -55 -108 -39 -124 18 -18
                          41 1 41 34 0 22 10 41 34 65 29 29 41 34 79 34 57 0 99 -29 78 -54 -12 -14 -9
                          -16 33 -16 l46 0 0 47 c0 45 -1 46 -19 29 -13 -11 -21 -14 -26 -7 -22 36 -107
                          55 -160 36z"
                      />
                      <path
                        d="M297 193 c-4 -3 -7 -20 -7 -36 0 -20 -11 -40 -34 -63 -29 -29 -41
                          -34 -79 -34 -57 0 -99 29 -78 54 12 14 9 16 -33 16 l-46 0 0 -47 c0 -43 1 -45
                          18 -30 15 14 19 14 40 -4 61 -49 150 -43 208 15 32 32 61 107 49 126 -7 11
                          -28 13 -38 3z"
                      />
                    </g>
                  </svg>
                </div>
                <div
                  onClick={handleImportClick}
                  className="bg-[#334355] hover:bg-[#334355] text-white rounded-lg flex items-center justify-center"
                  style={{ width: 35, height: 35, cursor: "pointer" }}
                  aria-label="Nhập file"
                >
                  {/* Upload SVG icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                </div>
              </div>
            </>
          }
          isOnline={isOnline}
          onSearch={(term) => {
            setTerm(term);
            setPageNumber(1);
          }}
        >
          <StrategyProductTableComponent
            data={strategyProductList}
            loading={loading}
            currentPage={pageNumber}
            onPageChange={handlePageChange}
            totalCount={totalCount}
            searchTerm={term ?? ""}
            onPageSizeChange={handlePageSizeChange}
            onSelectedIdsChange={setSelectedIds}
          />
          <Modal
            isOpen={isBulkModalOpen}
            onClose={() => setIsBulkModalOpen(false)}
            className="
              w-full max-w-[800px] flex flex-col rounded-lg shadow-xl bg-white mx-auto
              h-[95vh] md:h-auto
              max-h-screen md:max-h-[90vh]
              my-2 sm:my-4 md:my-8
              overflow-y-auto md:overflow-hidden
            "
          >
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (selectedIds.length === 0) {
                  toast.error("Vui lòng chọn ít nhất một sản phẩm");
                  return;
                }
                try {
                  await productStore.bulkUpdateStrategyProducts({
                    ids: selectedIds,
                    editStrategyProductDto: {
                      ...productStore.bulkEditDto,
                      policyStandard:
                        productStore.bulkEditDto.policyStandard ?? 76,
                      firstPolicyStandardAfterDiscount:
                        productStore.bulkEditDto
                          .firstPolicyStandardAfterDiscount ?? 5,
                      secondPolicyStandardAfterDiscount:
                        productStore.bulkEditDto
                          .secondPolicyStandardAfterDiscount ?? 5,
                    },
                  });
                  setIsBulkModalOpen(false);
                  productStore.resetBulkEditDto();
                } catch (error) {
                  console.error("Error updating products:", error);
                  toast.error("Có lỗi xảy ra khi cập nhật sản phẩm");
                }
              }}
              className="flex flex-col flex-grow h-full min-h-0"
            >
              <div className="p-4 md:p-6 border-b flex-shrink-0">
                <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
                  Cập nhật giá hàng loạt
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-4 md:py-3 px-6 flex-grow overflow-y-auto min-h-0">
                <div>
                  <ProductLabel htmlFor="quantityPerBox">
                    Số lượng/thùng
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="quantityPerBox"
                    name="quantityPerBox"
                    placeholder="Nhập số lượng/thùng"
                    value={productStore.bulkEditDto.quantityPerBox ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "quantityPerBox",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="listPrice">Giá niêm yết</ProductLabel>
                  <ProductInputField
                    type="number"
                    id="listPrice"
                    name="listPrice"
                    placeholder="Nhập giá niêm yết"
                    value={productStore.bulkEditDto.listPrice ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "listPrice",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="supplierRisingPrice">
                    Giá tăng NCC
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="supplierRisingPrice"
                    name="supplierRisingPrice"
                    placeholder="Nhập giá tăng NCC"
                    value={productStore.bulkEditDto.supplierRisingPrice ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "supplierRisingPrice",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="otherPriceByCompany">
                    Giá khác (Cty)
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="otherPriceByCompany"
                    name="otherPriceByCompany"
                    placeholder="Nhập giá khác (Cty)"
                    value={productStore.bulkEditDto.otherPriceByCompany ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "otherPriceByCompany",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="quantityPerBox">Số lượng</ProductLabel>
                  <ProductInputField
                    type="number"
                    id="quantityPerBox"
                    name="quantityPerBox"
                    placeholder="Nhập số lượng"
                    value={productStore.bulkEditDto.quantityPerBox ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "quantityPerBox",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="shippingFee">
                    Phí vận chuyển
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="shippingFee"
                    name="shippingFee"
                    placeholder="Nhập phí vận chuyển"
                    value={productStore.bulkEditDto.shippingFee ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "shippingFee",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="taxId">Thuế</ProductLabel>
                  <ReactSelect<{ value: number; label: string }>
                    placeholder="Chọn thuế"
                    noOptionsMessage={() => "Không có kết quả"}
                    options={productSupplierTaxList.map((tax) => ({
                      value: tax.id,
                      label: tax.name,
                    }))}
                    value={
                      productSupplierTaxList.find(
                        (tax) => tax.id === productStore.bulkEditDto.taxId
                      )
                        ? {
                            value: productStore.bulkEditDto.taxId!,
                            label: productSupplierTaxList.find(
                              (tax) => tax.id === productStore.bulkEditDto.taxId
                            )!.name,
                          }
                        : null
                    }
                    onChange={(e) =>
                      productStore.setBulkEditField("taxId", e?.value ?? null)
                    }
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
                  <ProductLabel htmlFor="weightPerUnit">
                    Khối lượng/viên
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="weightPerUnit"
                    name="weightPerUnit"
                    placeholder="Nhập khối lượng/viên"
                    value={productStore.bulkEditDto.weightPerUnit ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "weightPerUnit",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="discount">Chiết khấu</ProductLabel>
                  <ProductInputField
                    type="number"
                    id="discount"
                    name="discount"
                    placeholder="Nhập chiết khấu"
                    value={productStore.bulkEditDto.discount ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "discount",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="supplierDiscountCash">
                    Chiết khấu tiền mặt NCC
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="supplierDiscountCash"
                    name="supplierDiscountCash"
                    placeholder="Nhập chiết khấu tiền mặt NCC"
                    value={productStore.bulkEditDto.supplierDiscountCash ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "supplierDiscountCash",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="supplierDiscountPercentage">
                    Chiết khấu % NCC
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="supplierDiscountPercentage"
                    name="supplierDiscountPercentage"
                    placeholder="Nhập chiết khấu % NCC"
                    value={
                      productStore.bulkEditDto.supplierDiscountPercentage ?? ""
                    }
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "supplierDiscountPercentage",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="policyStandard">
                    Chính sách chuẩn
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="policyStandard"
                    name="policyStandard"
                    placeholder="Nhập chính sách chuẩn"
                    value={productStore.bulkEditDto.policyStandard ?? 76}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "policyStandard",
                        e.target.value === "" ? 76 : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="firstPolicyStandardAfterDiscount">
                    Chính sách 1 sau CK
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="firstPolicyStandardAfterDiscount"
                    name="firstPolicyStandardAfterDiscount"
                    placeholder="Nhập chính sách 1 sau CK"
                    value={
                      productStore.bulkEditDto
                        .firstPolicyStandardAfterDiscount ?? 5
                    }
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "firstPolicyStandardAfterDiscount",
                        e.target.value === "" ? 5 : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="secondPolicyStandardAfterDiscount">
                    Chính sách 2 sau CK
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="secondPolicyStandardAfterDiscount"
                    name="secondPolicyStandardAfterDiscount"
                    placeholder="Nhập chính sách 2 sau CK"
                    value={
                      productStore.bulkEditDto
                        .secondPolicyStandardAfterDiscount ?? 5
                    }
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "secondPolicyStandardAfterDiscount",
                        e.target.value === "" ? 5 : Number(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <div className="p-4 md:p-3 border-t flex-shrink-0">
                <Button
                  type="submit"
                  disabled={
                    selectedIds.length === 0 ||
                    Object.values(productStore.bulkEditDto).every(
                      (v) => v === null
                    )
                  }
                  className="w-full bg-blue-600 text-white"
                >
                  Cập nhật
                </Button>
              </div>
            </form>
          </Modal>
        </TableComponentCard>
      </div>
    </>
  );
};

export default observer(StrategyProductTable);
