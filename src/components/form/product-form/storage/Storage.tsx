import { useStore } from "../../../../app/stores/store.ts";
import ReactSelect from "react-select";
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

const StorageGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
  const { productStore, storageStore } = useStore();
  const { productStorageList } = storageStore;
  const { theme } = useTheme();
  // Mapping list
  const storageOptions: Option[] = productStorageList.map((storage) => ({
    value: storage.id,
    label: storage.name,
  }));

  const storageId =
    typeof product?.storageId === "number"
      ? product.storageId
      : productStore.productForm.storageId;
  const selectedStorage = storageOptions.find(
    (option) => option.value === storageId
  );

  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={storageOptions}
          value={selectedStorage}
          noOptionsMessage={() => "Không có phương thức"}
          onChange={(selected) => {
            if (!selected) {
              if (onChange) {
                onChange("storageId", product?.storageId);
              } else if (isCreateMode) {
                productStore.updateProductForm("storageId", null);
              }
              return;
            }

            if (isCreateMode) {
              const storageId = selected.value;
              if (onChange) {
                onChange("storageId", storageId);
              } else if (isCreateMode) {
                productStore.updateProductForm("storageId", storageId);
              }
            }
          }}
          placeholder={"Chọn phương thức..."}
          isClearable={true}
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

export default observer(StorageGroup);
