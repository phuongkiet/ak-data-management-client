import ComponentCard from "../../../../common/ComponentCard.tsx";
import ProductLabel from "../../ProductLabel.tsx";
import Input from "../../input/product/ProductInputField.tsx";
import { useStore } from "../../../../../app/stores/store.ts";
import { observer } from "mobx-react-lite";
import { StrategyProductDetailDto } from "../../../../../app/models/product/product.model.ts";
import { NumericFormat } from "react-number-format";

interface ProductProps {
  product?: StrategyProductDetailDto;
}

const StrategyProductDefaultInputs = ({ product }: ProductProps) => {
  const { productStore } = useStore();
  const form = productStore.strategyProductForm;
  const update = productStore.updateStrategyProductForm;
  const { supplierTaxStore } = useStore();
  const { productSupplierTaxList } = supplierTaxStore;
  const detail = productStore.strategyProductDetail;

  const calculate = () => {
    const selectedTax = productSupplierTaxList?.find((tax: { id: number }) => tax.id === (form.taxId ?? 0));
    const tempDetail = {
      ...product,
      ...form,
      id: product?.id ?? 0,
      autoBarcode: product?.autoBarcode ?? '',
      companyItemCode: product?.companyItemCode ?? '',
      supplierItemCode: product?.supplierItemCode ?? '',
      size: product?.size ?? '',
      supplierName: product?.supplierName ?? '',
      displayWebsiteName: product?.displayWebsiteName ?? '',
      changedUnit: product?.changedUnit ?? '',
      calculatedUnit: product?.calculatedUnit ?? '',
      area: product?.area ?? 0,
      quantityPerBox: product?.quantityPerBox ?? 0,
      weightPerBox: product?.weightPerBox ?? 0,
      areaPerBox: product?.areaPerBox ?? 0,
      weightPerUnit: product?.weightPerUnit ?? 0,
      listPrice: form.listPrice === null ? undefined : form.listPrice,
      supplierRisingPrice: form.supplierRisingPrice === null ? undefined : form.supplierRisingPrice,
      otherPriceByCompany: form.otherPriceByCompany === null ? undefined : form.otherPriceByCompany,
      quantity: form.quantity === null ? undefined : form.quantity,
      shippingFee: form.shippingFee === null ? undefined : form.shippingFee,
      discount: form.discount === null ? undefined : form.discount,
      policyStandard: form.policyStandard === null || form.policyStandard === undefined ? 0 : form.policyStandard,
      policyStandardNumber: product?.policyStandardNumber ?? 0,
      supplierDiscountCash: form.supplierDiscountCash === null ? undefined : form.supplierDiscountCash,
      supplierDiscountPercentage: form.supplierDiscountPercentage === null ? undefined : form.supplierDiscountPercentage,
      firstPolicyStandardAfterDiscount: form.firstPolicyStandardAfterDiscount === null ? undefined : form.firstPolicyStandardAfterDiscount,
      secondPolicyStandardAfterDiscount: form.secondPolicyStandardAfterDiscount === null ? undefined : form.secondPolicyStandardAfterDiscount,
      taxId: form.taxId === null || form.taxId === undefined ? 0 : form.taxId,
      taxStatus: product?.taxStatus ?? '',
      taxRate: selectedTax?.taxRate ?? 0,
      taxRateNumber: selectedTax ? 1 + (selectedTax.taxRate ?? 0) / 100 : 1,
    };
    productStore.calculateStrategyProductFields(tempDetail);
  };

  return (
    <ComponentCard title="Thông tin giá mã hàng">
      <div className="grid grid-cols-2 gap-6">
        {/* Cột trái */}
        <div className="space-y-6">
          <div className="space-y-0">
            <ProductLabel htmlFor="input">Giá niêm yết</ProductLabel>
            <NumericFormat
              value={detail?.listPrice ?? form.listPrice ?? ""}
              thousandSeparator
              displayType="input"
              allowNegative={false}
              disabled={false}
              placeholder="Nhập giá niêm yết"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              onValueChange={(values) =>
                { update("listPrice", values.floatValue ?? 0); calculate(); }
              }
            />
          </div>
          <div>
            <ProductLabel htmlFor="input">Giá tăng do NCC</ProductLabel>
            <NumericFormat
              value={detail?.supplierRisingPrice ?? form.supplierRisingPrice ?? ""}
              thousandSeparator
              displayType="input"
              allowNegative={false}
              disabled={false}
              placeholder="Nhập giá tăng"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              onValueChange={(values) =>
                { update("supplierRisingPrice", values.floatValue ?? 0); calculate(); }
              }
            />
          </div>
          <div>
            <ProductLabel htmlFor="input">Giá khác do An Khánh</ProductLabel>
            <NumericFormat
              value={detail?.otherPriceByCompany ?? form.otherPriceByCompany ?? ""}
              thousandSeparator
              displayType="input"
              allowNegative={false}
              disabled={false}
              placeholder="Nhập giá khác"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              onValueChange={(values) =>
                { update("otherPriceByCompany", values.floatValue ?? 0); calculate(); }
              }
            />
          </div>
          <div>
            <ProductLabel htmlFor="input">Phí vận chuyển</ProductLabel>
            <NumericFormat
              value={detail?.shippingFee ?? form.shippingFee ?? ""}
              thousandSeparator
              displayType="input"
              allowNegative={false}
              disabled={false}
              placeholder="Nhập phí vận chuyển"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              onValueChange={(values) =>
                { update("shippingFee", values.floatValue ?? 0); calculate(); }
              }
            />
          </div>
          <div>
            <ProductLabel>Xác nhận giá niêm yết</ProductLabel>
            <NumericFormat
              value={detail.confirmListPrice ?? ""}
              thousandSeparator
              displayType="input"
              allowNegative={false}
              disabled
              placeholder="Ô tự động điền"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
            />
          </div>
          <div>
            <ProductLabel>Số lượng</ProductLabel>
            <Input
              type="text"
              disabled={false}
              placeholder="Nhập số lượng"
              value={detail?.quantity ?? form.quantity ?? ""}
              onChange={(e) => { update("quantity", Number(e.target.value)); calculate(); }}
            />
          </div>
        </div>

        {/* Cột phải */}
        <div className="space-y-6">
          <div>
            <ProductLabel>Chiết khấu</ProductLabel>
            <Input
              type="text"
              disabled={false}
              placeholder="Nhập chiết khấu"
              value={detail?.discount ?? form.discount ?? ""}
              onChange={(e) => { update("discount", Number(e.target.value)); calculate(); }}
            />
          </div>
          <div>
            <ProductLabel>Tiền phải trả NCC (ước tính)</ProductLabel>
            <NumericFormat
              value={detail.supplierEstimatedPayableAmount ?? ""}
              thousandSeparator
              displayType="input"
              disabled
              placeholder="Ô tự động điền"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
            />
          </div>
          <div>
            <ProductLabel>Giá bán lẻ chưa KM</ProductLabel>
            <NumericFormat
              value={detail.retailPrice ?? ""}
              thousandSeparator
              displayType="input"
              disabled
              placeholder="Ô tự động điền"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
            />
          </div>
          <div>
            <ProductLabel>Khuyến mãi tiền mặt NCC</ProductLabel>
            <NumericFormat
              value={detail?.supplierDiscountCash ?? form.supplierDiscountCash ?? ""}
              thousandSeparator
              displayType="input"
              disabled={false}
              placeholder="Nhập khuyến mãi tiền mặt"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              onValueChange={(values) =>
                { update("supplierDiscountCash", values.floatValue ?? 0); calculate(); }
              }
            />
          </div>
          <div>
            <ProductLabel>Khuyến mãi % của NCC</ProductLabel>
            <Input
              type="number"
              disabled={false}
              placeholder="Nhập % khuyến mãi"
              value={detail?.supplierDiscountPercentage ?? form.supplierDiscountPercentage ?? ""}
              onChange={(e) => { update("supplierDiscountPercentage", Number(e.target.value)); calculate(); }}
            />
          </div>
          <div>
            <ProductLabel>Giá mua sau KM NCC (ước tính)</ProductLabel>
            <NumericFormat
              value={Math.round(detail.estimatedPurchasePriceAfterSupplierDiscount ?? 0)}
              thousandSeparator
              displayType="input"
              disabled
              placeholder="Ô tự động điền"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
            />
          </div>
        </div>
      </div>
    </ComponentCard>
  );
};

export default observer(StrategyProductDefaultInputs);
