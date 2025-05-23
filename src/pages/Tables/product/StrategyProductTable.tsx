import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import StrategyProductTableComponent from "../../../components/tables/product/StrategyProductTableComponent.tsx";
import { useStore } from "../../../app/stores/store.ts";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import Modal from "../../../components/ui/modal/index.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import ProductLabel from "../../../components/form/product-form/ProductLabel";
import ProductInputField from "../../../components/form/product-form/input/product/ProductInputField";
import ReactSelect from "react-select";
import { toast } from "react-toastify";

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
  const { productSupplierTaxList } = supplierTaxStore;
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkEditDto, setBulkEditDto] = useState({
    listPrice: null as number | null,
    supplierRisingPrice: null as number | null,
    otherPriceByCompany: null as number | null,
    quantity: null as number | null,
    shippingFee: null as number | null,
    discount: null as number | null,
    policyStandard: null as number | null,
    supplierDiscountCash: null as number | null,
    supplierDiscountPercentage: null as number | null,
    firstPolicyStandardAfterDiscount: null as number | null,
    secondPolicyStandardAfterDiscount: null as number | null,
    taxId: null as number | null,
  });

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
          additionalButtons={
            <Button
              className="ml-2 h-8 py-5 font-semibold rounded bg-sky-700 hover:bg-sky-800"
              disabled={selectedIds.length === 0}
              onClick={() => setIsBulkModalOpen(true)}
            >
              Cập nhật giá
            </Button>
          }
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
            searchTerm={term ?? ''}
            onPageSizeChange={handlePageSizeChange}
            onSelectedIdsChange={setSelectedIds}
          />
          <Modal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} className="p-8 w-full max-w-[800px]">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (selectedIds.length === 0) {
                  toast.error('Vui lòng chọn ít nhất một sản phẩm');
                  return;
                }
                try {
                  await productStore.bulkUpdateStrategyProducts({
                    ids: selectedIds,
                    editStrategyProductDto: {
                      listPrice: bulkEditDto.listPrice,
                      supplierRisingPrice: bulkEditDto.supplierRisingPrice,
                      otherPriceByCompany: bulkEditDto.otherPriceByCompany,
                      quantity: bulkEditDto.quantity,
                      shippingFee: bulkEditDto.shippingFee,
                      discount: bulkEditDto.discount,
                      policyStandard: bulkEditDto.policyStandard ?? 76,
                      supplierDiscountCash: bulkEditDto.supplierDiscountCash,
                      supplierDiscountPercentage: bulkEditDto.supplierDiscountPercentage,
                      firstPolicyStandardAfterDiscount: bulkEditDto.firstPolicyStandardAfterDiscount ?? 5,
                      secondPolicyStandardAfterDiscount: bulkEditDto.secondPolicyStandardAfterDiscount ?? 5,
                      taxId: bulkEditDto.taxId
                    }
                  });
                  setIsBulkModalOpen(false);
                  setBulkEditDto({
                    listPrice: null,
                    supplierRisingPrice: null,
                    otherPriceByCompany: null,
                    quantity: null,
                    shippingFee: null,
                    discount: null,
                    policyStandard: null,
                    supplierDiscountCash: null,
                    supplierDiscountPercentage: null,
                    firstPolicyStandardAfterDiscount: null,
                    secondPolicyStandardAfterDiscount: null,
                    taxId: null,
                  });
                } catch (error) {
                  console.error('Error updating products:', error);
                  toast.error('Có lỗi xảy ra khi cập nhật sản phẩm');
                }
              }}
            >
              <h1 className="text-2xl font-bold mb-4">Cập nhật giá hàng loạt</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ProductLabel htmlFor="listPrice">Giá niêm yết</ProductLabel>
                  <ProductInputField
                    type="number"
                    id="listPrice"
                    name="listPrice"
                    placeholder="Nhập giá niêm yết"
                    value={bulkEditDto.listPrice ?? ''}
                    onChange={e =>
                      setBulkEditDto(dto => ({
                        ...dto,
                        listPrice: e.target.value === '' ? null : Number(e.target.value)
                      }))
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="supplierRisingPrice">Giá tăng NCC</ProductLabel>
                  <ProductInputField
                    type="number"
                    id="supplierRisingPrice"
                    name="supplierRisingPrice"
                    placeholder="Nhập giá tăng NCC"
                    value={bulkEditDto.supplierRisingPrice ?? ''}
                    onChange={e =>
                      setBulkEditDto(dto => ({
                        ...dto,
                        supplierRisingPrice: e.target.value === '' ? null : Number(e.target.value)
                      }))
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="otherPriceByCompany">Giá khác (Cty)</ProductLabel>
                  <ProductInputField
                    type="number"
                    id="otherPriceByCompany"
                    name="otherPriceByCompany"
                    placeholder="Nhập giá khác (Cty)"
                    value={bulkEditDto.otherPriceByCompany ?? ''}
                    onChange={e =>
                      setBulkEditDto(dto => ({
                        ...dto,
                        otherPriceByCompany: e.target.value === '' ? null : Number(e.target.value)
                      }))
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="quantity">Số lượng</ProductLabel>
                  <ProductInputField
                    type="number"
                    id="quantity"
                    name="quantity"
                    placeholder="Nhập số lượng"
                    value={bulkEditDto.quantity ?? ''}
                    onChange={e =>
                      setBulkEditDto(dto => ({
                        ...dto,
                        quantity: e.target.value === '' ? null : Number(e.target.value)
                      }))
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="shippingFee">Phí vận chuyển</ProductLabel>
                  <ProductInputField
                    type="number"
                    id="shippingFee"
                    name="shippingFee"
                    placeholder="Nhập phí vận chuyển"
                    value={bulkEditDto.shippingFee ?? ''}
                    onChange={e =>
                      setBulkEditDto(dto => ({
                        ...dto,
                        shippingFee: e.target.value === '' ? null : Number(e.target.value)
                      }))
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
                    value={bulkEditDto.discount ?? ''}
                    onChange={e =>
                      setBulkEditDto(dto => ({
                        ...dto,
                        discount: e.target.value === '' ? null : Number(e.target.value)
                      }))
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="policyStandard">Chính sách chuẩn</ProductLabel>
                  <ProductInputField
                    type="number"
                    id="policyStandard"
                    name="policyStandard"
                    placeholder="Nhập chính sách chuẩn"
                    value={bulkEditDto.policyStandard ?? 76}
                    onChange={e =>
                      setBulkEditDto(dto => ({
                        ...dto,
                        policyStandard: e.target.value === '' ? 76 : Number(e.target.value)
                      }))
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="supplierDiscountCash">Chiết khấu tiền mặt NCC</ProductLabel>
                  <ProductInputField
                    type="number"
                    id="supplierDiscountCash"
                    name="supplierDiscountCash"
                    placeholder="Nhập chiết khấu tiền mặt NCC"
                    value={bulkEditDto.supplierDiscountCash ?? ''}
                    onChange={e =>
                      setBulkEditDto(dto => ({
                        ...dto,
                        supplierDiscountCash: e.target.value === '' ? null : Number(e.target.value)
                      }))
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="supplierDiscountPercentage">Chiết khấu % NCC</ProductLabel>
                  <ProductInputField
                    type="number"
                    id="supplierDiscountPercentage"
                    name="supplierDiscountPercentage"
                    placeholder="Nhập chiết khấu % NCC"
                    value={bulkEditDto.supplierDiscountPercentage ?? ''}
                    onChange={e =>
                      setBulkEditDto(dto => ({
                        ...dto,
                        supplierDiscountPercentage: e.target.value === '' ? null : Number(e.target.value)
                      }))
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="firstPolicyStandardAfterDiscount">Chính sách 1 sau CK</ProductLabel>
                  <ProductInputField
                    type="number"
                    id="firstPolicyStandardAfterDiscount"
                    name="firstPolicyStandardAfterDiscount"
                    placeholder="Nhập chính sách 1 sau CK"
                    value={bulkEditDto.firstPolicyStandardAfterDiscount ?? 5}
                    onChange={e =>
                      setBulkEditDto(dto => ({
                        ...dto,
                        firstPolicyStandardAfterDiscount: e.target.value === '' ? 5 : Number(e.target.value)
                      }))
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="secondPolicyStandardAfterDiscount">Chính sách 2 sau CK</ProductLabel>
                  <ProductInputField
                    type="number"
                    id="secondPolicyStandardAfterDiscount"
                    name="secondPolicyStandardAfterDiscount"
                    placeholder="Nhập chính sách 2 sau CK"
                    value={bulkEditDto.secondPolicyStandardAfterDiscount ?? 5}
                    onChange={e =>
                      setBulkEditDto(dto => ({
                        ...dto,
                        secondPolicyStandardAfterDiscount: e.target.value === '' ? 5 : Number(e.target.value)
                      }))
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="taxId">Thuế</ProductLabel>
                  <ReactSelect<{ value: number; label: string }>
                    placeholder="Chọn thuế"
                    noOptionsMessage={() => 'Không có kết quả'}
                    options={productSupplierTaxList.map(tax => ({
                      value: tax.id,
                      label: tax.name
                    }))}
                    value={productSupplierTaxList.find(tax => tax.id === bulkEditDto.taxId) ? {
                      value: bulkEditDto.taxId!,
                      label: productSupplierTaxList.find(tax => tax.id === bulkEditDto.taxId)!.name
                    } : null}
                    onChange={e => setBulkEditDto(dto => ({ ...dto, taxId: e?.value ?? null }))}
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "44px", // Chiều cao tổng thể
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
              </div>
              <Button
                type="submit"
                disabled={
                  selectedIds.length === 0 ||
                  Object.values(bulkEditDto).every(v => v === null)
                }
                className="w-full bg-blue-600 text-white mt-6"
              >
                Cập nhật
              </Button>
            </form>
          </Modal>
        </TableComponentCard>
      </div>
    </>
  );
};

export default observer(StrategyProductTable);
