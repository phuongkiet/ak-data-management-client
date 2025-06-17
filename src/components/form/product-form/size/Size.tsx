import ComponentCard from "../../../common/ComponentCard.tsx";
import ProductLabel from "../ProductLabel.tsx";
import Input from "../input/product/ProductInputField.tsx";
import { useStore } from "../../../../app/stores/store.ts";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import ReactSelect from "react-select";
import { ProductDetail } from "../../../../app/models/product/product.model.ts";
import * as yup from "yup";
interface Option {
  value: number;
  label: string;
}

interface SizeGroupProps {
  product?: ProductDetail;
  isCreateMode: boolean;
  thicknessError: string;
  setThicknessError: (err: string) => void;
  onChange?: (field: string, value: any) => void;
}

const thicknessSchema = yup
  .number()
  .typeError("Độ dày phải là số")
  .required("Độ dày là bắt buộc")
  .min(1, "Độ dày tối thiểu là 1mm")
  .max(100, "Độ dày tối đa là 100mm");

const SizeGroup = ({
  product,
  isCreateMode,
  thicknessError,
  setThicknessError,
  onChange
}: SizeGroupProps) => {
  const { sizeStore, productStore } = useStore();
  const { productSizeList } = sizeStore;
  const [thickness, setThickness] = useState<number>(
    product?.thicknessSize || 9
  );

  // Mapping list
  const sizeOptions: Option[] = productSizeList.map((size) => ({
    value: size.id,
    label: size.autoSized,
  }));

  const selectedSize = sizeOptions.find(
    (option) =>
      option.value ===
      (isCreateMode
        ? productStore.productForm.actualSizeId
        : product?.actualSizeId)
  );

  const handleSizeChange = (selectedOption: Option | null) => {
    console.log('Selected size option:', selectedOption);
    
    if (selectedOption) {
      const size = productSizeList.find(s => s.id === selectedOption.value);
      console.log('Selected size:', size);
      
      if (size) {
        // Update size ID and company code
        if (onChange) {
          onChange("actualSizeId", selectedOption.value);
          onChange("companyCodeId", size.companyCodeId);
          // Calculate and update areas
          const areaPerUnit = (size.length * size.wide) / 1000000; // Convert mm² to m²
          const areaPerBox = areaPerUnit * (product?.quantityPerBox || 1);
          onChange("areaPerUnit", Number(areaPerUnit.toFixed(2)));
          onChange("areaPerBox", Number(areaPerBox.toFixed(2)));
        } else if (isCreateMode) {
          console.log('Updating form with size ID:', selectedOption.value);
          productStore.updateProductForm("actualSizeId", selectedOption.value);
          productStore.updateProductForm("companyCodeId", size.companyCodeId);
        }
      }
    } else {
      // Handle clearing the size
      if (onChange) {
        onChange("actualSizeId", null);
        onChange("companyCodeId", null);
        onChange("areaPerUnit", null);
        onChange("areaPerBox", null);
      } else if (isCreateMode) {
        productStore.updateProductForm("actualSizeId", null);
        productStore.updateProductForm("companyCodeId", null);
      }
    }
  };

  const handleThicknessChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);
    setThickness(value);
    
    if (onChange) {
      onChange("thicknessSize", value);
      // Recalculate areas when thickness changes
      const selectedSize = productSizeList.find(s => s.id === product?.actualSizeId);
      if (selectedSize) {
        const areaPerUnit = (selectedSize.length * selectedSize.wide) / 1000000; // Convert to m2
        const areaPerBox = areaPerUnit * (product?.quantityPerBox || 1);
        onChange("areaPerUnit", areaPerUnit);
        onChange("areaPerBox", areaPerBox);
      }
    } else if (isCreateMode) {
      productStore.updateProductForm("thicknessSize", value);
    }
    
    try {
      await thicknessSchema.validate(
        (value === undefined ? "" : value) as unknown
      );
      setThicknessError("");
    } catch (err: any) {
      setThicknessError(err.message);
    }
  };

  return (
    <ComponentCard title="Kích thước thực tế">
      <div className="space-y-6">
        <div>
          <ProductLabel>Dài x Rộng</ProductLabel>
          <div className="relative">
            <ReactSelect
              options={sizeOptions}
              value={selectedSize}
              onChange={handleSizeChange}
              placeholder={"Chọn kích thước..."}
              noOptionsMessage={() => "Không có kích thước"}
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
          <ProductLabel>Độ dày (mm)</ProductLabel>
          <div className="relative">
            <Input
              type="number"
              placeholder="9mm"
              value={isCreateMode ? thickness : product?.thicknessSize}
              onChange={handleThicknessChange}
              error={!!thicknessError}
              hint={thicknessError}
            />
          </div>
        </div>
      </div>
    </ComponentCard>
  );
};

export default observer(SizeGroup);
