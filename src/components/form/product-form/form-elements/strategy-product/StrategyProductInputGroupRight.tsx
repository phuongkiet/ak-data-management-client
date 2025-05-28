import ComponentCard from "../../../../common/ComponentCard.tsx";
import ProductLabel from "../../ProductLabel.tsx";
import { useStore } from "../../../../../app/stores/store.ts";
import { StrategyProductDetailDto } from "../../../../../app/models/product/product.model.ts";
import ReactSelect from "react-select";
import { NumericFormat } from "react-number-format";
import { observer } from "mobx-react-lite";

interface ProductProps {
  product?: StrategyProductDetailDto;
}

const StrategyProductInputGroupRight = ({
  product,
}: ProductProps) => {
  const { productStore, supplierTaxStore } = useStore();
  const form = productStore.strategyProductForm;
  const update = productStore.updateStrategyProductForm;
  const { productSupplierTaxList } = supplierTaxStore;

  const calculate = () => {
    // Gọi hàm tính toán trên store, truyền vào object detail tạm thời (kết hợp form và detail)
    const tempDetail = {
      ...product,
      ...form,
      id: product?.id ?? 0,
      autoBarCode: product?.autoBarCode ?? '',
      companyItemCode: product?.companyItemCode ?? '',
      supplierItemCode: product?.supplierItemCode ?? '',
      size: product?.size ?? '',
      supplierName: product?.supplierName ?? '',
      displayWebsiteName: product?.displayWebsiteName ?? '',
      changedUnit: product?.changedUnit ?? '',
      calculatedUnit: product?.calculatedUnit ?? '',
      area: product?.area ?? 0,
      listPrice: form.listPrice === null ? undefined : form.listPrice,
      supplierRisingPrice: form.supplierRisingPrice === null ? undefined : form.supplierRisingPrice,
      otherPriceByCompany: form.otherPriceByCompany === null ? undefined : form.otherPriceByCompany,
      quantity: form.quantity === null ? undefined : form.quantity,
      shippingFee: form.shippingFee === null ? undefined : form.shippingFee,
      discount: form.discount === null ? undefined : form.discount,
      policyStandard: form.policyStandard === null || form.policyStandard === undefined ? 0 : form.policyStandard,
      supplierDiscountCash: form.supplierDiscountCash === null ? undefined : form.supplierDiscountCash,
      supplierDiscountPercentage: form.supplierDiscountPercentage === null ? undefined : form.supplierDiscountPercentage,
      firstPolicyStandardAfterDiscount: form.firstPolicyStandardAfterDiscount === null ? undefined : form.firstPolicyStandardAfterDiscount,
      secondPolicyStandardAfterDiscount: form.secondPolicyStandardAfterDiscount === null ? undefined : form.secondPolicyStandardAfterDiscount,
      taxId: form.taxId === null || form.taxId === undefined ? 0 : form.taxId,
      taxStatus: product?.taxStatus ?? '',
      taxRate: product?.taxRate ?? 0,
      taxRateNumber: product?.taxRateNumber ?? 0,
      policyStandardNumber: product?.policyStandardNumber ?? 0,
    };
    productStore.calculateStrategyProductFields(tempDetail);
  };

  return (
    <ComponentCard title="Thuế và Chính sách">
      <div>
        <ProductLabel>Chính sách chuẩn</ProductLabel>
        <NumericFormat
          value={form.policyStandard ?? ""}
          thousandSeparator
          displayType="input"
          disabled={false}
          placeholder="Nhập chính sách chuẩn"
          allowNegative={false}
          min={0}
          max={100}
          isAllowed={(values) => {
            const { floatValue } = values;
            return floatValue === undefined || floatValue <= 100;
          }}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
          onValueChange={(values) => {
            const value = values.floatValue ?? 0;
            update("policyStandard", value);
            calculate();
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <ProductLabel>Giá còn lại sau KM 1</ProductLabel>
          <NumericFormat
            value={product?.firstRemainingPriceAfterDiscount ?? ""}
            thousandSeparator
            displayType="input"
            disabled
            placeholder="Ô tự động điền"
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
          />
        </div>
        <div>
          <ProductLabel>Giá còn lại sau KM 2</ProductLabel>
          <NumericFormat
            value={product?.secondRemainingPriceAfterDiscount ?? ""}
            thousandSeparator
            displayType="input"
            disabled
            placeholder="Ô tự động điền"
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <ProductLabel htmlFor="input">Chính sách 1</ProductLabel>
          <NumericFormat
            value={form?.firstPolicyStandardAfterDiscount ?? ""}
            thousandSeparator
            displayType="input"
            disabled={false}
            placeholder="Nhập chính sách 1"
            allowNegative={false}
            min={0}
            max={100}
            isAllowed={(values) => {
              const { floatValue } = values;
              return floatValue === undefined || floatValue <= 100;
            }}
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
            onValueChange={(values) => {
              const value = values.floatValue ?? 0;
              update("firstPolicyStandardAfterDiscount", value);
              calculate();
            }}
          />
        </div>
        <div>
          <ProductLabel htmlFor="input">Chính sách 2</ProductLabel>
          <NumericFormat
            value={form.secondPolicyStandardAfterDiscount ?? ""}
            thousandSeparator
            displayType="input"
            disabled={false}
            placeholder="Nhập chính sách 2"
            allowNegative={false}
            min={0}
            max={100}
            isAllowed={(values) => {
              const { floatValue } = values;
              return floatValue === undefined || floatValue <= 100;
            }}
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
            onValueChange={(values) => {
              const value = values.floatValue ?? 0;
              update("secondPolicyStandardAfterDiscount", value);
              calculate();
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <ProductLabel htmlFor="input">Giá cố định 1</ProductLabel>
          <NumericFormat
            value={product?.firstFixedPolicyPrice ?? ""}
            thousandSeparator
            displayType="input"
            disabled
            placeholder="Ô tự động điền"
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
          />
        </div>
        <div>
          <ProductLabel htmlFor="input">Giá cố định 2</ProductLabel>
          <NumericFormat
            value={product?.secondFixedPolicyPrice ?? ""}
            thousandSeparator
            displayType="input"
            disabled
            placeholder="Ô tự động điền"
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <ProductLabel htmlFor="input">Giá thực thu 1</ProductLabel>
          <NumericFormat
            value={product?.firstActualReceivedPriceAfterPolicyDiscount ?? ""}
            thousandSeparator
            displayType="input"
            disabled
            placeholder="Ô tự động điền"
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
          />
        </div>
        <div>
          <ProductLabel htmlFor="input">Giá thực thu 2</ProductLabel>
          <NumericFormat
            value={product?.secondActualReceivedPriceAfterPolicyDiscount ?? ""}
            thousandSeparator
            displayType="input"
            disabled
            placeholder="Ô tự động điền"
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
          />
        </div>
      </div>
      <div>
        <ProductLabel htmlFor="input">Thuế</ProductLabel>
        <ReactSelect<{ value: number; label: string }>
          placeholder="Chọn thuế"
          noOptionsMessage={() => "Không có kết quả"}
          options={productSupplierTaxList.map((tax) => ({
            value: tax.id,
            label: tax.name,
          }))}
          value={
            form.taxId != null
              ? productSupplierTaxList.find((tax) => tax.id === form.taxId)
                ? { value: form.taxId, label: productSupplierTaxList.find((tax) => tax.id === form.taxId)!.name }
                : null
              : null
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
          onChange={(option) => {
            update("taxId", option?.value ?? null);
            calculate();
          }}
        />
      </div>
    </ComponentCard>
  );
}

export default observer(StrategyProductInputGroupRight);
