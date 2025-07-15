import ComponentCard from "../../../common/ComponentCard.tsx";
import ProductLabel from "../ProductLabel.tsx";
import Input from "../input/product/ProductInputField.tsx";
import { useStore } from "../../../../app/stores/store.ts";
import { useState, useEffect } from "react";
import ReactSelect from "react-select";
// import { ProductPatternDto } from '../../../../app/models/product/productPattern.model.ts'
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

const PatternGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
  const { theme } = useTheme();
  const { productStore, patternStore } = useStore();
  const { productPatternList } = patternStore
  const [selectedPatternShortCode, setSelectedPatternShortCode] = useState<string>("");

  // Đồng bộ shortCode khi đổi pattern ở edit mode
  useEffect(() => {
    if (!isCreateMode && product?.brickPatternId) {
      const pattern = productPatternList.find(x => x.id === product.brickPatternId);
      setSelectedPatternShortCode(pattern?.shortCode || "");
    }
  }, [isCreateMode, product?.brickPatternId, productPatternList]);

  // Mapping list
  const patternOptions: Option[] = productPatternList.map((pattern) => ({
    value: pattern.id,
    label: pattern.name,
  }));

  const selectedPattern = patternOptions.find(
    (option) => option.value === (isCreateMode ? productStore.productForm.brickPatternId : product?.brickPatternId)
  );

  return (
    <ComponentCard title="Danh mục (hệ vân/ thiết bị vệ sinh)">
      <div className="space-y-6">
        <div>
          <ProductLabel>Tên danh mục</ProductLabel>
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
                const pattern = productPatternList.find(x => x.id === selected.value);
                setSelectedPatternShortCode(pattern?.shortCode || "");
              }}
              value={selectedPattern}
              isClearable={true}
              placeholder={"Chọn danh mục..."}
              className="react-select-container"
              classNamePrefix="react-select"
              noOptionsMessage={() => "Không có danh mục"}
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
        <div>
          <ProductLabel>Mã ngắn danh mục</ProductLabel>
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
