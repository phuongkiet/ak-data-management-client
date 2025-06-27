import ComponentCard from "../../../../common/ComponentCard.tsx";
import ProductLabel from "../../ProductLabel.tsx";
import { useStore } from "../../../../../app/stores/store.ts";
import { observer } from "mobx-react-lite";
import { NumericFormat } from "react-number-format";
// import { useEffect } from "react";
import ReactSelect from "react-select";
import { toJS } from "mobx";
import { useTheme } from '../../../../../app/context/ThemeContext.tsx';

interface Option {
  label: string;
  value: number;
}

const SupplierDefaultInput = () => {
  const { supplierStore, supplierTaxStore, factoryStore } = useStore();
  const { productSupplierTaxList } = supplierTaxStore;
  const { productFactoryList } = factoryStore;
  const { supplierFormDetail } = supplierStore;
  const form = supplierFormDetail;
  const update = supplierStore.updateSupplierFormDetail;
  const { theme } = useTheme();

  // Tax options and selected value
  const taxOptions = toJS(productSupplierTaxList).map((tax) => ({
    value: Number(tax.id),
    label: tax.name,
  }));
  const selectedTax = form.taxId != null
    ? taxOptions.find((tax) => tax.value === form.taxId)
    : null;

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

  const handleChangeSupplierName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSupplierName = e.target.value.toUpperCase().trim();
    update("supplierName", newSupplierName);

    const newSupplierNameForCode = newSupplierName
      .replace(/ /g, "")
      .toUpperCase();

    const currentCodeName = form.supplierCodeName;
    const parts = currentCodeName.split("-");

    if (parts.length >= 3) {
      const middlePart = parts[parts.length - 2];
      const shortCode = parts[parts.length - 1];
      const newSupplierCodeName = `${newSupplierNameForCode}-${middlePart}-${shortCode}`;
      update("supplierCodeName", newSupplierCodeName);
    } else {
      const lastDashIndex = currentCodeName.lastIndexOf("-");
      if (lastDashIndex !== -1) {
        const suffix = currentCodeName.substring(lastDashIndex);
        const newSupplierCodeName = newSupplierNameForCode + suffix;
        update("supplierCodeName", newSupplierCodeName);
      } else {
        const newSupplierCodeName = newSupplierNameForCode;
        update("supplierCodeName", newSupplierCodeName);
      }
    }
  };

  const handleSupplierNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newSupplierName = e.target.value;
    if (form.firstContactInfomation === "") {
      update("firstContactInfomation", `Liên hệ 1 ${newSupplierName}`);
    }

    if (form.secondContactInfomation === "") {
      update("secondContactInfomation", `Liên hệ 2 ${newSupplierName}`);
    }

    if (form.supplierStorageAddress === "") {
      update("supplierStorageAddress", `Địa chỉ kho ${newSupplierName}`);
    }
  };

  const handleSupplierShortCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newShortCode = e.target.value.toUpperCase().trim();
    update("supplierShortCode", newShortCode);

    const currentCodeName = form.supplierCodeName;
    const lastDashIndex = currentCodeName.lastIndexOf("-");
    
    if (lastDashIndex !== -1) {
      // Giữ nguyên phần trước dấu "-" cuối cùng và thay thế phần sau
      const prefix = currentCodeName.substring(0, lastDashIndex + 1);
      const newSupplierCodeName = prefix + newShortCode;
      update("supplierCodeName", newSupplierCodeName);
    } else {
      // Nếu không có dấu "-", chỉ cập nhật shortCode
      update("supplierCodeName", newShortCode);
    }
  };

  return (
    <ComponentCard title="Thông tin nhà cung cấp">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="space-y-6 pr-6 border-r border-gray-200">
            {/* Basic Information */}
            <div className="w-full">
              <label
                className="mb-3 block text-black dark:text-white"
                htmlFor="supplierName"
              >
                Tên nhà cung cấp
              </label>
              <input
                type="text"
                id="supplierName"
                value={form.supplierName ?? ""}
                onChange={handleChangeSupplierName}
                onBlur={handleSupplierNameBlur}
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
                onChange={handleSupplierShortCodeChange}
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
                    backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
                    color: theme === 'dark' ? '#fff' : base.color,
                    borderColor: theme === 'dark' ? '#384052' : base.borderColor,
                    border: theme === 'dark' ? '1px solid #384052' : '1px solid #e5e7eb',
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    height: "44px",
                    padding: "0 8px",
                    backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
                    color: theme === 'dark' ? '#fff' : base.color,
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    height: "44px",
                    backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
                  }),
                  option: (base, state) => ({
                    ...base,
                    fontFamily: "Roboto, sans-serif",
                    backgroundColor: state.isFocused
                      ? (theme === 'dark' ? '#23232b' : '#f3f4f6')
                      : (theme === 'dark' ? '#131827' : 'white'),
                    color: theme === 'dark' ? '#fff' : 'black',
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
                    color: theme === 'dark' ? '#fff' : base.color,
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: theme === 'dark' ? '#fff' : base.color,
                  }),
                  input: (base) => ({
                    ...base,
                    color: theme === 'dark' ? '#fff' : base.color,
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
                    backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
                    color: theme === 'dark' ? '#fff' : base.color,
                    borderColor: theme === 'dark' ? '#384052' : base.borderColor,
                    border: theme === 'dark' ? '1px solid #384052' : '1px solid #e5e7eb',
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    height: "44px",
                    padding: "0 8px",
                    backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
                    color: theme === 'dark' ? '#fff' : base.color,
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    height: "44px",
                    backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
                  }),
                  option: (base, state) => ({
                    ...base,
                    fontFamily: "Roboto, sans-serif",
                    backgroundColor: state.isFocused
                      ? (theme === 'dark' ? '#23232b' : '#f3f4f6')
                      : (theme === 'dark' ? '#131827' : 'white'),
                    color: theme === 'dark' ? '#fff' : 'black',
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
                    color: theme === 'dark' ? '#fff' : base.color,
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: theme === 'dark' ? '#fff' : base.color,
                  }),
                  input: (base) => ({
                    ...base,
                    color: theme === 'dark' ? '#fff' : base.color,
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
                value={form.supplierStorageAddress ?? "Địa chỉ kho " + form.supplierName}
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
                value={form.firstContactInfomation ?? "Liên hệ 1 " + form.supplierName}
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
                <ProductLabel htmlFor="input">Chiết khấu (%)</ProductLabel>
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
                Phần trăm thanh toán nhanh (%)
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
                Phần trăm doanh số quý (%)
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
                Phần trăm doanh số năm (%)
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
                Phần trăm thay đổi số lượng (%)
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
                Phần trăm trả lại số lượng (%)
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
