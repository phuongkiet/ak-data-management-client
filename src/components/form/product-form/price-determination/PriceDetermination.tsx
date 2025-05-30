import { observer } from "mobx-react-lite";
import ReactSelect from "react-select";
import { ProductDetail } from "../../../../app/models/product/product.model.ts";
import { PriceDetermination } from "../../../../app/models/product/enum/product.enum.ts";
import { useStore } from "../../../../app/stores/store.ts";
interface Option {
  value: number;
  label: string;
}

interface ProductProps {
  product?: ProductDetail;
  isCreateMode: boolean;
  onChange?: (field: string, value: any) => void;
}

const priceDeterminationOptions: Option[] = Object.values(PriceDetermination)
  .filter((v) => typeof v === "number")
  .map((value) => ({
    value: value as number,
    label: PriceDetermination[value as number]
      .replace(/([A-Z])/g, " $1")
      .trim(),
  }));

const PriceDeterminationGroup = ({
  product,
  isCreateMode,
  onChange,
}: ProductProps) => {
  const { productStore } = useStore();
  const selectedPriceDetermination = priceDeterminationOptions.find(
    (option) => option.value === product?.priceDetermination
  );

  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={priceDeterminationOptions}
          value={selectedPriceDetermination}
          defaultValue={priceDeterminationOptions[2]}
          noOptionsMessage={() => "Không có phương pháp xác định giá"}
          onChange={(selected) => {
            if (!selected) {
              if (onChange) {
                onChange("priceDetermination", 0);
              } else if (isCreateMode) {
                productStore.updateProductForm("priceDetermination", 0);
              }
            }

            if (onChange) {
              onChange("priceDetermination", selected?.value || 0);
            } else {
              productStore.updateProductForm(
                "priceDetermination",
                selected?.value || 0
              );
            }
          }}
          placeholder={"Chọn ..."}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: "44px",
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

export default observer(PriceDeterminationGroup);
