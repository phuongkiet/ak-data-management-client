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
}

const AreaGroup = ({ isCreateMode }: ProductProps) => {
  const { areaStore, supplierStore } = useStore();
  const { loadAreas, productAreaList } =
  areaStore;

  useEffect(() => {
    loadAreas();
  }, []);

  // Mapping list
  const areaOptions: Option[] = productAreaList.map(
    (area) => ({
      value: area.id,
      label: area.areaName,
    })
  );

  const selectedArea = areaOptions.find(
    (option) => option.value === supplierStore.areaValue.id
  );
  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={areaOptions}
          value={selectedArea}
          onChange={(selectedOption) => {
            if (!selectedOption) {
              supplierStore.updateAreaValue("id", 0);
              supplierStore.updateAreaValue("areaName", "");
              supplierStore.updateAreaValue("upperName", "");
              supplierStore.updateAreaValue("shortCode", "");
              return;
            } else {
              const selectedArea = productAreaList.find(
                (u) => u.id === selectedOption.value
              );
              supplierStore.updateAreaValue(
                "id",
                selectedOption.value
              );
              supplierStore.updateAreaValue(
                "areaName",
                selectedArea?.areaName || ""
              );
              supplierStore.updateAreaValue(
                "upperName",
                selectedArea?.upperName || ""
              );
              supplierStore.updateAreaValue("shortCode", selectedArea?.shortCode || "");
            }

            if (isCreateMode) {
              const selectedArea = productAreaList.find(
                (u) => u.id === selectedOption.value
              );
              supplierStore.updateAreaValue(
                "id",
                selectedOption.value
              );
              supplierStore.updateAreaValue(
                "areaName",
                selectedArea?.areaName || ""
              );
              supplierStore.updateAreaValue(
                "upperName",
                selectedArea?.upperName || ""
              );
              supplierStore.updateAreaValue("shortCode", selectedArea?.shortCode || "");
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

export default observer(AreaGroup);
