import ReactSelect from "react-select";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../app/stores/store.ts";
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

const WaterAbsorptionGroup = ({
  product,
  isCreateMode,
  onChange,
}: ProductProps) => {
  const { productStore, waterAbsorptionStore } = useStore();
  const { productWaterAbsorptionList } = waterAbsorptionStore
  const { theme } = useTheme();
  // Mapping list
  const waterAbsorptionOptions: Option[] = productWaterAbsorptionList.map(
    (waterAbsorption) => ({
      value: waterAbsorption.id,
      label: waterAbsorption.waterAbsoprtionLevel,
    })
  );

  const waterAbsorptionId = typeof product?.waterAbsorptionId === 'number' ? product.waterAbsorptionId : productStore.productForm.waterAbsorptionId

  const selectedWaterAbsorption = waterAbsorptionOptions.find(
    (option) => option.value === waterAbsorptionId
  );

  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={waterAbsorptionOptions}
          value={selectedWaterAbsorption}
          noOptionsMessage={() => "Không có độ hút nước"}
          onChange={(selected) => {
            if (!selected) {
              if (onChange) {
                onChange("waterAbsorptionId", product?.waterAbsorptionId);
              } else if (isCreateMode) {
                productStore.updateProductForm("waterAbsorptionId", null);
              }
              return;
            }
            if (onChange) {
              onChange("waterAbsorptionId", selected.value | 0);
            } else {
              productStore.updateProductForm(
                "waterAbsorptionId",
                selected.value | 0
              );
            }
          }}
          placeholder={"Chọn..."}
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

export default observer(WaterAbsorptionGroup);
