import ComponentCard from "../../../../common/ComponentCard.tsx";
import ProductLabel from "../../ProductLabel.tsx";
import Input from "../../input/product/ProductInputField.tsx";
import { useStore } from "../../../../../app/stores/store.ts";
import { observer } from "mobx-react-lite";
import { StrategyProductDetailDto } from "../../../../../app/models/product/product.model.ts";
import { NumericFormat } from "react-number-format";
import { useEffect } from "react";
interface ProductProps {
  product?: StrategyProductDetailDto;
}

const StrategyProductDefaultInputs = ({ product }: ProductProps) => {
  const { productStore } = useStore();
  const form = productStore.strategyProductForm;
  const update = productStore.updateStrategyProductForm;
  const detail = productStore.strategyProductDetail;
  useEffect(() => {
    if (product?.taxId && product.taxId !== form.taxId) {
      update("taxId", product.taxId);
    }
  }, [product?.taxId, form.taxId, update]);

  return (
    <ComponentCard title="Thông tin giá mã hàng">
      <div className="grid grid-cols-2 gap-6">
        {/* Cột trái */}
        <div className="space-y-6">
          <div className="space-y-0">
            <ProductLabel htmlFor="input">Giá niêm yết</ProductLabel>
            <NumericFormat
              value={product?.listPrice ?? form.listPrice ?? ""}
              thousandSeparator
              displayType="input"
              allowNegative={false}
              disabled={false}
              placeholder="Nhập giá niêm yết"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              onValueChange={(values) => {
                const value = values.floatValue ?? 0;
                update("listPrice", value);
              }}
            />
          </div>
          <div>
            <ProductLabel htmlFor="input">Giá tăng do NCC</ProductLabel>
            <NumericFormat
              value={product?.supplierRisingPrice ?? form.supplierRisingPrice ?? ""}
              thousandSeparator
              displayType="input"
              allowNegative={false}
              disabled={false}
              placeholder="Nhập giá tăng"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              onValueChange={(values) => {
                const value = values.floatValue ?? 0;
                update("supplierRisingPrice", value);
              }}
            />
          </div>
          <div>
            <ProductLabel htmlFor="input">Giá khác do An Khánh</ProductLabel>
            <NumericFormat
              value={product?.otherPriceByCompany ?? form.otherPriceByCompany ?? ""}
              thousandSeparator
              displayType="input"
              allowNegative={false}
              disabled={false}
              placeholder="Nhập giá khác"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              onValueChange={(values) => {
                const value = values.floatValue ?? 0;
                update("otherPriceByCompany", value);
              }}
            />
          </div>
          <div>
            <ProductLabel htmlFor="input">Phí vận chuyển</ProductLabel>
            <NumericFormat
              value={product?.shippingFee ?? form.shippingFee ?? ""}
              thousandSeparator
              displayType="input"
              allowNegative={false}
              disabled={false}
              placeholder="Nhập phí vận chuyển"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              onValueChange={(values) => {
                const value = values.floatValue ?? 0;
                update("shippingFee", value);
              }}
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
            <ProductLabel>Số lượng/thùng</ProductLabel>
            <Input
              type="number"
              placeholder="Ô tự động điền"
              step={0.1}
              value={form.quantityPerBox ?? product?.quantityPerBox ?? 0}
              onChange={(e) => {
                update("quantityPerBox", Number(e.target.value) ?? 0);
              }}
            />
          </div>
        </div>

        {/* Cột phải */}
        <div className="space-y-6">
          <div>
            <ProductLabel>Chiết khấu (%)</ProductLabel>
            <Input
              type="text"   
              disabled={false}
              placeholder="Nhập chiết khấu"
              value={detail?.discount ?? form.discount ?? ""}
              onChange={(e) => {
                update("discount", Number(e.target.value));
              }}
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
              value={
                detail?.supplierDiscountCash ?? form.supplierDiscountCash ?? ""
              }
              thousandSeparator
              displayType="input"
              disabled={false}
              placeholder="Nhập khuyến mãi tiền mặt"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              onValueChange={(values) => {
                const value = values.floatValue ?? 0;
                const roundedValue = Math.round(value / 1000) * 1000;
                update("supplierDiscountCash", roundedValue);
              }}
            />
          </div>
          <div>
            <ProductLabel>Khuyến mãi % của NCC</ProductLabel>
            <Input
              type="number"
              disabled={false}
              placeholder="Nhập % khuyến mãi"
              value={
                detail?.supplierDiscountPercentage ??
                form.supplierDiscountPercentage ??
                ""
              }
              onChange={(e) => {
                update("supplierDiscountPercentage", Number(e.target.value));
              }}
            />
          </div>
          <div>
            <ProductLabel>Giá mua sau KM NCC (ước tính)</ProductLabel>
            <NumericFormat
              value={detail.estimatedPurchasePriceAfterSupplierDiscount ?? ""}
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
