import ComponentCard from "../../../common/ComponentCard.tsx";
import ProductLabel from "../ProductLabel.tsx";
import Input from "../input/product/ProductInputField.tsx";
import { useStore } from "../../../../app/stores/store.ts";
import ReactSelect from "react-select";
import { observer } from "mobx-react-lite";
import { ProductDetail } from "../../../../app/models/product/product.model.ts";
import { useState } from "react";
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

const ColorGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
  const { productStore, colorStore } = useStore();
  const { productColorList } = colorStore;
  const [hexColor, setHexColor] = useState<string>("");
  const { theme } = useTheme();

  // Mapping list
  const colorOptions: Option[] = productColorList.map((color) => ({
    value: color.id,
    label: color.name,
  }));

  const selectedColor = colorOptions.find(
    (option) => option.value === product?.colorId
  );

  const getSelectedColorHex = () => {
    if (isCreateMode) {
      const color = productColorList.find(
        (c) => c.id === productStore.productForm.colorId
      );
      return color?.colorHexCode || "#ffffff";
    } else {
      const color = productColorList.find((c) => c.id === product?.colorId);
      return color?.colorHexCode || "#ffffff";
    }
  };

  const getTextColorClass = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return white text for dark backgrounds, black for light backgrounds
    return luminance > 0.5 ? "text-gray-900" : "text-white";
  };

  return (
    <ComponentCard title="Màu gạch">
      <div className="space-y-6">
        <div>
          <ProductLabel>Tên màu</ProductLabel>
          <div className="relative">
            <ReactSelect
              options={colorOptions}
              value={selectedColor}
              noOptionsMessage={() => "Không có màu gạch"}
              onChange={(selected) => {
                if (!selected) {
                  if (onChange) {
                    onChange("colorId", product?.colorId);
                  } else if (isCreateMode) {
                    productStore.updateProductForm("colorId", null);
                  }
                  setHexColor("");
                  return;
                }

                if (onChange) {
                  onChange("colorId", selected.value);
                } else if (isCreateMode) {
                  productStore.updateProductForm("colorId", selected.value);
                  const color = productColorList.find(
                    (c) => c.id === selected.value
                  );
                  setHexColor(color?.colorHexCode || "");
                }
              }}
              placeholder={"Chọn màu gạch..."}
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
        {isCreateMode ? (
          <div>
            <ProductLabel>Mã màu</ProductLabel>
            <div className="w-full">
              <Input
                placeholder="Tự động điền"
                value={hexColor}
                className={`w-full ${getTextColorClass(hexColor || "#ffffff")}`}
                style={{ backgroundColor: hexColor || "#ffffff" }}
              />
            </div>
          </div>
        ) : (
          <div>
            <ProductLabel>Mã màu</ProductLabel>
            <div className="w-full">
              <Input
                placeholder="Tự động điền"
                value={getSelectedColorHex()}
                className={`w-full ${getTextColorClass(getSelectedColorHex())}`}
                style={{ backgroundColor: getSelectedColorHex() }}
              />
            </div>
          </div>
        )}
      </div>
    </ComponentCard>
  );
};

export default observer(ColorGroup);
