import ComponentCard from "../../../../common/ComponentCard.tsx";
import ProductLabel from "../../ProductLabel.tsx";
import Input from "../../input/product/ProductInputField.tsx";
// import { useStore } from "../../../../../app/stores/store.ts";
import { observer } from "mobx-react-lite";
import { StrategyProductDetailDto } from "../../../../../app/models/product/product.model.ts";
import { NumericFormat } from "react-number-format";
import { useStore } from "../../../../../app/stores/store.ts";
interface ProductProps {
  product?: StrategyProductDetailDto;
}

const StrategyProductGeneralInfo = ({ product }: ProductProps) => {
  const { productStore } = useStore();
  const form = productStore.strategyProductForm;
  const update = productStore.updateStrategyProductForm;
  return (
    <ComponentCard title="Thông tin mã hàng">
      <div className="grid grid-cols-2 gap-6">
        {/* Cột trái */}
        <div className="space-y-6">
          <div>
            <ProductLabel>Mã barcode</ProductLabel>
            <Input
              type="text"
              disabled
              placeholder="Ô tự động điền"
              value={product?.autoBarcode || ""}
            />
          </div>
          <div>
            <ProductLabel>Mã SKU</ProductLabel>
            <Input
              type="text"
              disabled
              placeholder="Ô tự động điền"
              value={product?.supplierItemCode || ""}
            />
          </div>
          <div>
            <ProductLabel>Nhà cung cấp</ProductLabel>
            <Input
              type="text"
              disabled
              placeholder="Ô tự động điền"
              value={product?.supplierName || ""}
            />
          </div>
          <div>
            <ProductLabel>Kích thước</ProductLabel>
            <Input
              type="text"
              disabled
              placeholder="Ô tự động điền"
              value={product?.size || ""}
            />
          </div>
        </div>

        {/* Cột phải */}
        <div className="space-y-6">
          {/* Hàng 1: Đơn vị tính | Đơn vị tính tự động */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <ProductLabel>ĐVT</ProductLabel>
              <Input
                type="text"
                disabled
                placeholder="Ô tự động điền"
                value={product?.calculatedUnit || ""}
              />
            </div>
            <div>
              <ProductLabel>ĐVT chuẩn</ProductLabel>
              <Input
                type="text"
                disabled
                placeholder="Ô tự động điền"
                value={product?.changedUnit || ""}
              />
            </div>
          </div>
          {/* Hàng 2: Kg/viên, Kg/thùng | m2/viên, m2/thùng */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-6">
              <div>
                <ProductLabel>Kg/viên</ProductLabel>
                <Input
                  type="number"
                  step={0.1}
                  placeholder="Ô tự động điền"
                  value={product?.weightPerUnit?.toString() ?? form.weightPerUnit?.toString() ?? ""}
                  onChange={(e) => {
                    const weightPerUnit = parseFloat(e.target.value) ?? 0;
                    update("weightPerUnit", weightPerUnit);
                    // Không update lại weightPerUnit * quantityPerBox ở đây!
                  }}
                />
              </div>
              <div>
                <ProductLabel>m2/viên</ProductLabel>
                <Input
                  type="number"
                  step={0.01}
                  placeholder="Ô tự động điền"
                  value={product?.area?.toString() ?? ""}
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <ProductLabel>Kg/thùng</ProductLabel>
                <Input
                  type="number"
                  disabled
                  placeholder="Ô tự động điền"
                  value={product?.weightPerBox?.toString() || ""}
                />
              </div>
              <div>
                <ProductLabel>m2/thùng</ProductLabel>
                <Input
                  type="number"
                  disabled
                  placeholder="Ô tự động điền"
                  value={product?.areaPerBox?.toString() || ""}
                />
              </div>
            </div>
          </div>
          {/* Hàng 3: Giá website | Giá khuyến mãi 1 | Giá khuyến mãi 2 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <ProductLabel>Giá website</ProductLabel>
              <NumericFormat
                value={product?.webProductPrice ?? ""}
                thousandSeparator
                displayType="input"
                disabled
                placeholder="Ô tự động điền"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              />
            </div>
            <div>
              <ProductLabel>Giá KM 1</ProductLabel>
              <NumericFormat
                value={product?.webDiscountedPrice ?? ""}
                thousandSeparator
                displayType="input"
                disabled
                placeholder="Ô tự động điền"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              />
            </div>
            <div>
              <ProductLabel>Giá KM 2</ProductLabel>
              <NumericFormat
                value={product?.webSecondDiscountedPrice ?? ""}
                thousandSeparator
                displayType="input"
                disabled
                placeholder="Ô tự động điền"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              />
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  );
};

export default observer(StrategyProductGeneralInfo);
