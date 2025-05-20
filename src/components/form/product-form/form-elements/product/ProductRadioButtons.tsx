import { useState } from "react";
import ComponentCard from "../../../../common/ComponentCard.tsx";
import ProductRadio from "../../input/product/ProductRadio.tsx";

export default function ProductRadioButtons() {
  const [selectedValue, setSelectedValue] = useState<string>("option2");

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };
  return (
    <ComponentCard title="ProductRadio Buttons">
      <div className="flex flex-wrap items-center gap-8">
        <ProductRadio
          id="radio1"
          name="group1"
          value="option1"
          checked={selectedValue === "option1"}
          onChange={handleRadioChange}
          label="Default"
        />
        <ProductRadio
          id="radio2"
          name="group1"
          value="option2"
          checked={selectedValue === "option2"}
          onChange={handleRadioChange}
          label="Selected"
        />
        <ProductRadio
          id="radio3"
          name="group1"
          value="option3"
          checked={selectedValue === "option3"}
          onChange={handleRadioChange}
          label="Disabled"
          disabled={true}
        />
      </div>
    </ComponentCard>
  );
}
