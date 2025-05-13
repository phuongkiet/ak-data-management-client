import { useEffect } from "react";
import ReactSelect from "react-select";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../app/stores/store.ts";
import { ProductDetail } from "../../../../app/models/product/product.model.ts";

interface Option {
  value: number;
  label: string;
}

interface ProductProps {
  product?: ProductDetail;
  isCreateMode: boolean;
  onChange?: (field: string, value: any) => void;
}

const WaterAbsorptionGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
  const { waterAbsorptionStore, productStore } = useStore();
  const { loadWaterAbsorption, productWaterAbsorptionList } =
    waterAbsorptionStore;

  useEffect(() => {
    loadWaterAbsorption();
  }, []);

  // Mapping list
  const waterAbsorptionOptions: Option[] = productWaterAbsorptionList.map(
    (waterAbsorption) => ({
      value: waterAbsorption.id,
      label: waterAbsorption.waterAbsoprtionLevel,
    })
  );

  const selectedWaterAbsorption = waterAbsorptionOptions.find(
    (option) => option.value === product?.waterAbsorptionId
  );

  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={waterAbsorptionOptions}
          value={selectedWaterAbsorption}
          onChange={(selected) => {
            if(!selected){
              if (onChange) {
                onChange("waterAbsorptionId", product?.waterAbsorptionId);
              } else if (isCreateMode) {
                productStore.updateProductForm("waterAbsorptionId", null);
              }
              return;
            }
            if(isCreateMode){
              if (onChange) {
                onChange("waterAbsorptionId", selected.value | 0);
              } else {
                productStore.updateProductForm("waterAbsorptionId", selected.value | 0);
              }
            }
          }}
          placeholder={"Chọn..."}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: "44px", // Chiều cao tổng thể
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
    </div>
  );
};

export default observer(WaterAbsorptionGroup);
