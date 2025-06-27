import ReactSelect from "react-select";
import { useStore } from "../../../../app/stores/store.ts";
import { observer } from "mobx-react-lite";
import { ProductDetail } from "../../../../app/models/product/product.model.ts";
import { useTheme } from "../../../../app/context/ThemeContext.tsx";

interface Option {
  value: number;
  label: string;
}

interface ProductProps {
  product?: ProductDetail;
  isCreateMode: boolean;
  onChange?: (field: string, value: any) => void;
}

const CompanyCodeGroup = ({
  product,
  isCreateMode,
  onChange,
}: ProductProps) => {
  const { productStore, companyCodeStore } = useStore();
  const { productCompanyCodeList } = companyCodeStore;
  const { theme } = useTheme();
  // Mapping list
  const companyCodeOptions: Option[] = productCompanyCodeList.map(
    (companyCode) => ({
      value: companyCode.id,
      label: companyCode.codeName,
    })
  );

  const selectedCompanyCode = companyCodeOptions.find(
    (option) =>
      option.value ===
      (isCreateMode
        ? productStore.productForm.companyCodeId
        : product?.companyCodeId)
  );

  const handleCompanyCodeChange = (selected: Option | null) => {
    if (!selected) {
      // Clear companyCodeId and confirmSupplierItemCode in productStore
      productStore.updateProductForm("companyCodeId", null);
      productStore.updateProductForm("confirmSupplierItemCode", "");
      if (onChange) {
        onChange("companyCodeId", null);
        onChange("confirmSupplierItemCode", "");
      }
      return;
    }

    const companyCodeId = selected.value;
    const companyCode = productCompanyCodeList.find(
      (x) => x.id === companyCodeId
    );

    if (companyCode?.codeName) {
      // Get the current code and extract everything after the first space
      const currentCode = product?.confirmSupplierItemCode || productStore.productForm.confirmSupplierItemCode || "";
      const codeAfterSpace = currentCode.includes(" ")
        ? currentCode.substring(currentCode.indexOf(" ") + 1)
        : "";

      // Create new code by combining new company code with existing code after space
      const newCode = codeAfterSpace
        ? `${companyCode.codeName} ${codeAfterSpace}`
        : companyCode.codeName;

      // Always update productStore
      productStore.updateProductForm("companyCodeId", companyCodeId);
      productStore.updateProductForm("confirmSupplierItemCode", newCode);
      // If parent wants to sync, call onChange
      if (onChange) {
        onChange("companyCodeId", companyCodeId);
        onChange("confirmSupplierItemCode", newCode);
      }
    }
  };

  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={companyCodeOptions}
          value={selectedCompanyCode}
          onChange={handleCompanyCodeChange}
          placeholder={"Chọn mã công ty..."}
          isClearable={true}
          noOptionsMessage={() => "Không có mã công ty"}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: "44px",
              height: "44px",
              fontFamily: "Roboto, sans-serif",
              fontSize: "14px",
              backgroundColor:
                theme === "dark" ? "#131827" : base.backgroundColor,
              color: theme === "dark" ? "#fff" : base.color,
              borderColor: theme === "dark" ? "#384052" : base.borderColor,
              border:
                theme === "dark" ? "1px solid #384052" : "1px solid #e5e7eb",
            }),
            valueContainer: (base) => ({
              ...base,
              height: "44px",
              padding: "0 8px",
              backgroundColor:
                theme === "dark" ? "#131827" : base.backgroundColor,
              color: theme === "dark" ? "#fff" : base.color,
            }),
            indicatorsContainer: (base) => ({
              ...base,
              height: "44px",
              backgroundColor:
                theme === "dark" ? "#131827" : base.backgroundColor,
            }),
            option: (base, state) => ({
              ...base,
              fontFamily: "Roboto, sans-serif",
              backgroundColor: state.isFocused
                ? theme === "dark"
                  ? "#23232b"
                  : "#f3f4f6"
                : theme === "dark"
                ? "#131827"
                : "white",
              color: theme === "dark" ? "#fff" : "black",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor:
                theme === "dark" ? "#131827" : base.backgroundColor,
              color: theme === "dark" ? "#fff" : base.color,
            }),
            singleValue: (base) => ({
              ...base,
              color: theme === "dark" ? "#fff" : base.color,
            }),
            input: (base) => ({
              ...base,
              color: theme === "dark" ? "#fff" : base.color,
            }),
          }}
        />
      </div>
    </div>
  );
};

export default observer(CompanyCodeGroup);
