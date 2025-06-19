import { useStore } from "../../../../app/stores/store.ts";
import { useEffect } from "react";
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
}

const AreaGroup = ({ isCreateMode }: ProductProps) => {
  const { areaStore, supplierStore } = useStore();
  const { loadAreas, productAreaList } =
  areaStore;
  const { theme } = useTheme();
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
          noOptionsMessage={() => "Không có khu vực"}
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

export default observer(AreaGroup);
