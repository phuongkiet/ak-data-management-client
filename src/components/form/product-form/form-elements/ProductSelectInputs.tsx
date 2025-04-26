import { useState } from "react";
import ComponentCard from "../../../common/ComponentCard.tsx";
import ProductLabel from "../ProductLabel.tsx";
import SupplierSelect from "../supplier/SupplierSelect.tsx";
import ProductMultiSelect from "../ProductMultiSelect.tsx";

export default function ProductSelectInputs() {
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const multiOptions = [
    { value: "1", text: "Option 1", selected: false },
    { value: "2", text: "Option 2", selected: false },
    { value: "3", text: "Option 3", selected: false },
    { value: "4", text: "Option 4", selected: false },
    { value: "5", text: "Option 5", selected: false },
  ];
  return (
    <ComponentCard title="SupplierSelect Inputs">
      <div className="space-y-6">
        <div>
          <ProductLabel>SupplierSelect Input</ProductLabel>
          <SupplierSelect
            options={options}
            placeholder="SupplierSelect Option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <ProductMultiSelect
            label="Multiple SupplierSelect Options"
            options={multiOptions}
            defaultSelected={["1", "3"]}
            onChange={(values) => setSelectedValues(values)}
          />
          <p className="sr-only">
            Selected Values: {selectedValues.join(", ")}
          </p>
        </div>
      </div>
    </ComponentCard>
  );
}
