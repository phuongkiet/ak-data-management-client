import ComponentCard from "../../../../common/ComponentCard.tsx";
import ProductLabel from "../../ProductLabel.tsx";
import { useStore } from "../../../../../app/stores/store.ts";
import { observer } from "mobx-react-lite";
import { NumericFormat } from "react-number-format";
// import { useEffect } from "react";
import ReactSelect from "react-select";
import { toJS } from "mobx";

interface Option {
  label: string;
  value: number;
}

const SupplierDefaultInput = () => {
  const { supplierStore, supplierTaxStore, factoryStore } = useStore();
  const { productSupplierTaxList } = supplierTaxStore;
  const { productFactoryList } = factoryStore;
  const form = supplierStore.supplierFormDetail;
  const update = supplierStore.updateSupplierFormDetail;

  // Tax options and selected value
  const taxOptions = toJS(productSupplierTaxList).map((tax) => ({
    value: Number(tax.id),
    label: tax.name,
  }));
  const selectedTax = form.taxId != null
    ? taxOptions.find((tax) => tax.value === form.taxId)
    : null;
  console.log("taxOptions", taxOptions);
  console.log("form.taxId", form.taxId, typeof form.taxId);
  console.log("selectedTax", selectedTax);

  // Factory options and selected value
  const factoryOptions: Option[] = toJS(productFactoryList).map(factory => ({
    value: Number(factory.id),
    label: factory.name
  }));

  // Ensure supplierFactories is always an array
  const selectedFactories = factoryOptions.filter(option =>
    Array.isArray(form.supplierFactories)
      ? form.supplierFactories.includes(option.value)
      : false
  );
  console.log("factoryOptions", factoryOptions);
  console.log("form.supplierFactories", form.supplierFactories);
  console.log("selectedFactories", selectedFactories);

  return (
    <ComponentCard title="Thông tin nhà cung cấp">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="space-y-6 pr-6 border-r border-gray-200">
            {/* Basic Information */}
            <div>
              <ProductLabel htmlFor="supplierName">
                Tên nhà cung cấp
              </ProductLabel>
              <input
                type="text"
                value={form.supplierName ?? ""}
                onChange={(e) => update("supplierName", e.target.value)}
                placeholder="Nhập tên nhà cung cấp"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              />
            </div>

            <div>
              <ProductLabel htmlFor="supplierCodeName">
                Mã nhà cung cấp
              </ProductLabel>
              <input
                type="text"
                value={form.supplierCodeName ?? ""}
                onChange={(e) => update("supplierCodeName", e.target.value)}
                placeholder="Nhập mã nhà cung cấp"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              />
            </div>

            <div>
              <ProductLabel htmlFor="supplierShortCode">
                Mã viết tắt
              </ProductLabel>
              <input
                type="text"
                value={form.supplierShortCode ?? ""}
                onChange={(e) => update("supplierShortCode", e.target.value)}
                placeholder="Nhập mã viết tắt"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              />
            </div>

            {/* Tax Selection */}
            <div>
              <ProductLabel htmlFor="taxId">Thuế</ProductLabel>
              <ReactSelect<Option>
                placeholder="Chọn thuế"
                noOptionsMessage={() => "Không có kết quả"}
                options={taxOptions}
                value={selectedTax}
                onChange={(option) => {
                  update("taxId", option?.value ?? null);
                }}
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

            {/* Factory Selection */}
            <div>
              <ProductLabel htmlFor="supplierFactories">Nhà máy</ProductLabel>
              <ReactSelect<Option, true>
                options={factoryOptions}
                value={selectedFactories}
                isMulti
                noOptionsMessage={() => "Không có nhà máy"}
                onChange={(selected) => {
                  const ids = selected ? selected.map((s: Option) => s.value) : [];
                  update("supplierFactories", ids);
                }}
                placeholder="Chọn nhà máy..."
                isClearable={true}
                closeMenuOnSelect={false}
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
              <ProductLabel htmlFor="supplierStorageAddress">
                Địa chỉ kho
              </ProductLabel>
              <input
                type="text"
                value={form.supplierStorageAddress ?? ""}
                onChange={(e) =>
                  update("supplierStorageAddress", e.target.value)
                }
                placeholder="Nhập địa chỉ kho"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              />
            </div>

            <div>
              <ProductLabel htmlFor="firstContactInfomation">
                Thông tin liên hệ 1
              </ProductLabel>
              <input
                type="text"
                value={form.firstContactInfomation ?? ""}
                onChange={(e) =>
                  update("firstContactInfomation", e.target.value)
                }
                placeholder="Nhập thông tin liên hệ 1"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              />
            </div>

            <div>
              <ProductLabel htmlFor="secondContactInfomation">
                Thông tin liên hệ 2
              </ProductLabel>
              <input
                type="text"
                value={form.secondContactInfomation ?? ""}
                onChange={(e) =>
                  update("secondContactInfomation", e.target.value)
                }
                placeholder="Nhập thông tin liên hệ 2"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6 pl-6">
            {/* Financial Information */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <ProductLabel htmlFor="input">Phí vận chuyển</ProductLabel>
                <NumericFormat
                  value={form.shippingFee ?? ""}
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
                <ProductLabel htmlFor="input">Chiết khấu</ProductLabel>
                <NumericFormat
                  value={form.discount ?? ""}
                  thousandSeparator
                  displayType="input"
                  allowNegative={false}
                  disabled={false}
                  placeholder="Nhập chiết khấu"
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                  onValueChange={(values) => {
                    const value = values.floatValue ?? 0;
                    update("discount", value);
                  }}
                />
              </div>
            </div>

            <div>
              <ProductLabel htmlFor="input">
                Giá chiết khấu tại kho
              </ProductLabel>
              <NumericFormat
                value={form.priceDiscountAtStorage ?? ""}
                thousandSeparator
                displayType="input"
                allowNegative={false}
                disabled={false}
                placeholder="Nhập giá chiết khấu tại kho"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                onValueChange={(values) => {
                  const value = values.floatValue ?? 0;
                  update("priceDiscountAtStorage", value);
                }}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">
                Phần trăm thanh toán nhanh
              </ProductLabel>
              <NumericFormat
                value={form.percentageOfFastPayment ?? ""}
                thousandSeparator
                displayType="input"
                allowNegative={false}
                disabled={false}
                placeholder="Nhập phần trăm thanh toán nhanh"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                onValueChange={(values) => {
                  const value = values.floatValue ?? 0;
                  update("percentageOfFastPayment", value);
                }}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">
                Số tiền thanh toán nhanh
              </ProductLabel>
              <NumericFormat
                value={form.amountOfFastPayment ?? ""}
                thousandSeparator
                displayType="input"
                allowNegative={false}
                disabled={false}
                placeholder="Nhập số tiền thanh toán nhanh"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                onValueChange={(values) => {
                  const value = values.floatValue ?? 0;
                  update("amountOfFastPayment", value);
                }}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">
                Phần trăm doanh số quý
              </ProductLabel>
              <NumericFormat
                value={form.percentageQuarterlySales ?? ""}
                thousandSeparator
                displayType="input"
                allowNegative={false}
                disabled={false}
                placeholder="Nhập phần trăm doanh số quý"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                onValueChange={(values) => {
                  const value = values.floatValue ?? 0;
                  update("percentageQuarterlySales", value);
                }}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">
                Phần trăm doanh số năm
              </ProductLabel>
              <NumericFormat
                value={form.percentageYearSales ?? ""}
                thousandSeparator
                displayType="input"
                allowNegative={false}
                disabled={false}
                placeholder="Nhập phần trăm doanh số năm"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                onValueChange={(values) => {
                  const value = values.floatValue ?? 0;
                  update("percentageYearSales", value);
                }}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">
                Phần trăm thay đổi số lượng
              </ProductLabel>
              <NumericFormat
                value={form.percentageChangeQuantity ?? ""}
                thousandSeparator
                displayType="input"
                allowNegative={false}
                disabled={false}
                placeholder="Nhập phần trăm thay đổi số lượng"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                onValueChange={(values) => {
                  const value = values.floatValue ?? 0;
                  update("percentageChangeQuantity", value);
                }}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">
                Phần trăm trả lại số lượng
              </ProductLabel>
              <NumericFormat
                value={form.percentageReturnQuantity ?? ""}
                thousandSeparator
                displayType="input"
                allowNegative={false}
                disabled={false}
                placeholder="Nhập phần trăm trả lại số lượng"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                onValueChange={(values) => {
                  const value = values.floatValue ?? 0;
                  update("percentageReturnQuantity", value);
                }}
              />
            </div>
          </div>
        </div>

        {/* Textarea Section */}
        <div className="grid grid-cols-1 gap-6 pt-6 border-t border-gray-200">
          <div>
            <ProductLabel htmlFor="productDocumentation">
              Tài liệu sản phẩm
            </ProductLabel>
            <textarea
              value={form.productDocumentation ?? ""}
              onChange={(e) => update("productDocumentation", e.target.value)}
              placeholder="Nhập tài liệu sản phẩm"
              className="h-24 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <ProductLabel htmlFor="warning">Cảnh báo</ProductLabel>
            <textarea
              value={form.warning ?? ""}
              onChange={(e) => update("warning", e.target.value)}
              placeholder="Nhập cảnh báo"
              className="h-24 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <ProductLabel htmlFor="otherNote">Ghi chú khác</ProductLabel>
            <textarea
              value={form.otherNote ?? ""}
              onChange={(e) => update("otherNote", e.target.value)}
              placeholder="Nhập ghi chú khác"
              className="h-24 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
            />
          </div>
        </div>
      </div>
    </ComponentCard>
  );
};

export default observer(SupplierDefaultInput);
