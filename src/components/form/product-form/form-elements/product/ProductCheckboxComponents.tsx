import { useState } from "react";
import ComponentCard from "../../../../common/ComponentCard.tsx";
import ProductCheckbox from "../../input/product/ProductCheckbox.tsx";

export default function ProductCheckboxComponents() {
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedTwo, setIsCheckedTwo] = useState(true);
  const [isCheckedDisabled, setIsCheckedDisabled] = useState(false);
  return (
    <ComponentCard title="ProductCheckbox">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <ProductCheckbox checked={isChecked} onChange={setIsChecked} />
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Default
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ProductCheckbox
            checked={isCheckedTwo}
            onChange={setIsCheckedTwo}
            label="Checked"
          />
        </div>
        <div className="flex items-center gap-3">
          <ProductCheckbox
            checked={isCheckedDisabled}
            onChange={setIsCheckedDisabled}
            disabled
            label="Disabled"
          />
        </div>
      </div>
    </ComponentCard>
  );
}
