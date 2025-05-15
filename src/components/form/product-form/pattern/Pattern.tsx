import ComponentCard from "../../../common/ComponentCard.tsx";
import ProductLabel from "../ProductLabel.tsx";
import Input from "../input/ProductInputField.tsx";
import { useStore } from "../../../../app/stores/store.ts";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";
// import { ProductPatternDto } from '../../../../app/models/product/productPattern.model.ts'
import { observer } from "mobx-react-lite";
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

const PatternGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
  const { patternStore, productStore } = useStore();
  const { loadPatterns, productPatternList } = patternStore;
  const [selectedPatternShortCode, setSelectedPatternShortCode] = useState<string>("");

  useEffect(() => {
    loadPatterns();
  }, []);

  // Mapping list
  const patternOptions: Option[] = productPatternList.map((pattern) => ({
    value: pattern.id,
    label: pattern.name,
  }));

  const selectedPattern = patternOptions.find(
    (option) => option.value === (isCreateMode ? productStore.productForm.brickPatternId : product?.brickPatternId)
  );

  return (
    <ComponentCard title="Hệ vân gạch">
      <div className="space-y-6">
        <div>
          <ProductLabel>Tên hệ vân</ProductLabel>
          <div className="relative">
            <ReactSelect
              options={patternOptions}
              onChange={(selected) => {
                if (!selected) {
                  if (onChange) {
                    onChange("brickPatternId", product?.brickPatternId);
                  } else if (isCreateMode) {
                    productStore.updateProductForm("brickPatternId", null);
                  }
                  setSelectedPatternShortCode("");
                  return;
                }
                if (onChange) {
                  onChange("brickPatternId", selected.value);
                } else if (isCreateMode) {
                  productStore.updateProductForm("brickPatternId", selected.value);
                }
                const pattern = patternStore.productPatternList.find(x => x.id === selected.value);
                setSelectedPatternShortCode(pattern?.shortCode || "");
              }}
              value={selectedPattern}
              isClearable={true}
              placeholder={"Chọn hệ vân..."}
              className="react-select-container"
              classNamePrefix="react-select"
              noOptionsMessage={() => "Không có hệ vân"}
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
        <div>
          <ProductLabel>Mã ngắn hệ vân</ProductLabel>
          <div className="relative">
            <Input
              placeholder="Tự động điền"
              disabled
              value={
                isCreateMode
                  ? selectedPatternShortCode
                  : product?.brickPatternShortName || ""
              }
            />
          </div>
        </div>
      </div>
    </ComponentCard>
  );
};

export default observer(PatternGroup);
