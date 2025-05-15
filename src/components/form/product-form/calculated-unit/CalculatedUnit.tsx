import { useStore } from "../../../../app/stores/store.ts";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import ReactSelect from "react-select";
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

const CalculatedUnitGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
  const { calculatedUnitStore, productStore } = useStore();
  const { loadCalculatedUnits, productCalculatedUnitList } =
    calculatedUnitStore;

  useEffect(() => {
    loadCalculatedUnits();
  }, []);

  // Mapping list
  const calculatedUnitOptions: Option[] = productCalculatedUnitList.map(
    (cal) => ({
      value: cal.id,
      label: cal.calculatedUnitName,
    })
  );

  const selectedCalculatedUnit = calculatedUnitOptions.find(
    (option) => option.value === product?.calculatedUnitId
  );
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

export default observer(CalculatedUnitGroup);
