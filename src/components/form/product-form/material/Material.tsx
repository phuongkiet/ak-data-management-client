import ComponentCard from "../../../common/ComponentCard.tsx";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../app/stores/store.ts";
import ReactSelect from "react-select";
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

const MaterialGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
  const { theme } = useTheme();
  const { materialStore, productStore } = useStore();
  const { productMaterialList } = materialStore;

  // Mapping list
  const materialOptions: Option[] = productMaterialList.map((material) => ({
    value: material.id,
    label: material.name,
  }));

  const selectedMaterial = materialOptions.find(
    (option) => option.value === product?.materialId
  );

  return (
    <ComponentCard title="Chất liệu">
      <div className="space-y-6">
        <div>
          <div className="relative">
            <ReactSelect
              options={materialOptions}
              value={selectedMaterial}
              noOptionsMessage={() => "Không có chất liệu"}
              onChange={(selected) => {
                if (!selected) {
                  if (onChange) {
                    onChange("materialId", product?.materialId);
                  } else if (isCreateMode) {
                    productStore.updateProductForm("materialId", null);
                  }
                  return;
                }
                if (onChange) {
                  onChange("materialId", selected.value);
                } else if (isCreateMode) {
                  productStore.updateProductForm("materialId", selected.value);
                }
              }}
              placeholder={"Chọn chất liệu..."}
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
                    theme === "dark"
                      ? "1px solid #384052"
                      : "1px solid #e5e7eb",
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
      </div>
    </ComponentCard>
  );
};

export default observer(MaterialGroup);
