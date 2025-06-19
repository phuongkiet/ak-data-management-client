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

const OriginGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
  const { theme } = useTheme();
  const { productStore, originStore } = useStore();
  const { productOriginList } = originStore;
  
  // Mapping list
  const originOptions: Option[] = productOriginList.map((origin) => ({
    value: origin.id,
    label: origin.name,
  }));

  const selectedOrigin = originOptions.find(
    (option) => option.value === product?.originCountryId
  );

  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={originOptions}
          value={selectedOrigin}
          onChange={(selected) => {
            if (!selected) {
              if (onChange) {
                onChange("originCountryId", product?.originCountryId);
              } else if (isCreateMode) {
                productStore.updateProductForm("originCountryId", null);
              }
              return;
            }

            const originId = selected.value;
            if (onChange) {
              onChange("originCountryId", originId);
            } else if (isCreateMode) {
              productStore.updateProductForm("originCountryId", originId);
            }
          }}
          isClearable={true}
          placeholder={"Chọn xuất xứ..."}
          noOptionsMessage={() => "Không có xuất xứ"}
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

export default observer(OriginGroup);
