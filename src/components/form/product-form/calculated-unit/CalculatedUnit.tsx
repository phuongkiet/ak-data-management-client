import { useStore } from "../../../../app/stores/store.ts";
import { observer } from "mobx-react-lite";
import ReactSelect from "react-select";
import { ProductDetail } from "../../../../app/models/product/product.model.ts";
import { useEffect } from "react";
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

const CalculatedUnitGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
  const { productStore, calculatedUnitStore } = useStore();
  const { productCalculatedUnitList } = calculatedUnitStore;
  const { theme } = useTheme();
  // Mapping list
  const calculatedUnitOptions: Option[] = productCalculatedUnitList.map(
    (cal) => ({
      value: cal.id,
      label: cal.calculatedUnitName,
    })
  );

  const calculatedUnitId =
    typeof product?.calculatedUnitId === 'number'
      ? product.calculatedUnitId
      : productStore.productForm.calculatedUnitId;

  const selectedCalculatedUnit = calculatedUnitOptions.find(
    (option) => option.value === calculatedUnitId
  );

  useEffect(() => {
    if (calculatedUnitId) {
      const selectedUnit = productCalculatedUnitList.find(
        (u) => u.id === calculatedUnitId
      );
      if (selectedUnit) {
        if (onChange) {
          onChange("autoCalculatedUnit", selectedUnit.autoCalculatedUnitName || "");
        } else if (isCreateMode) {
          productStore.updateProductForm("autoCalculatedUnit", selectedUnit.autoCalculatedUnitName || "");
        }
      }
    }
  }, [calculatedUnitId, productCalculatedUnitList]);

  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={calculatedUnitOptions}
          value={selectedCalculatedUnit}
          noOptionsMessage={() => "Không có đơn vị tính"}
          onChange={(selectedOption) => {
            if (!selectedOption) {
              if (onChange) {
                onChange("calculatedUnitId", product?.calculatedUnitId);
                onChange("autoCalculatedUnit", "");
              } else if (isCreateMode) {
                productStore.updateProductForm("calculatedUnitId", null);
                productStore.updateProductForm("autoCalculatedUnit", "");
              }
              return;
            }
            const selectedUnit = productCalculatedUnitList.find(
              (u) => u.id === selectedOption.value
            );
            if (onChange) {
              onChange("calculatedUnitId", selectedOption.value);
              onChange("autoCalculatedUnit", selectedUnit?.autoCalculatedUnitName || "");
            } else if (isCreateMode) {
              productStore.updateProductForm("calculatedUnitId", selectedOption.value);
              productStore.updateProductForm("autoCalculatedUnit", selectedUnit?.autoCalculatedUnitName || "");
            }
          }}
          placeholder={"Chọn đơn vị tính..."}
          isClearable={true}
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
    </div>
  );
};

export default observer(CalculatedUnitGroup);
