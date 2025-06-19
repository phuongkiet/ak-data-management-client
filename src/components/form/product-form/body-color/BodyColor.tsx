import { useStore } from "../../../../app/stores/store.ts";
import { observer } from "mobx-react-lite";
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

const BodyColorGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
  const { productStore, bodyColorStore } = useStore();
  const { productBodyColorList } = bodyColorStore;
  const { theme } = useTheme();
  // Mapping list
  const bodyColorOptions: Option[] = productBodyColorList.map((bodyColor) => ({
    value: bodyColor.id,
    label: bodyColor.name,
  }));

  const selectedBodyColor = bodyColorOptions.find(
    (option) => option.value === product?.brickBodyId
  );

  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={bodyColorOptions}
          value={selectedBodyColor}
          noOptionsMessage={() => "Không có màu thân gạch"}
          onChange={(selected) => {
            if (!selected) {
              if (onChange) {
                onChange("brickBodyId", product?.brickBodyId);
              } else if (isCreateMode) {
                productStore.updateProductForm("brickBodyId", null);
              }
              return;
            }

            if (onChange) {
              onChange("brickBodyId", selected.value);
            } else if (isCreateMode) {
              productStore.updateProductForm("brickBodyId", selected.value);
            }
          }}
          isClearable={true}
          placeholder={"Chọn màu thân gạch..."}
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

export default observer(BodyColorGroup);
