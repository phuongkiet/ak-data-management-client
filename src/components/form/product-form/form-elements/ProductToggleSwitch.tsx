import ComponentCard from "../../../common/ComponentCard.tsx";
import ProductSwitch from "../switch/ProductSwitch.tsx";

export default function ProductToggleSwitch() {
  const handleSwitchChange = (checked: boolean) => {
    console.log("Switch is now:", checked ? "ON" : "OFF");
  };
  return (
    <ComponentCard title="Toggle switch input">
      <div className="flex gap-4">
        <ProductSwitch
          label="Default"
          defaultChecked={true}
          onChange={handleSwitchChange}
        />
        <ProductSwitch
          label="Checked"
          defaultChecked={true}
          onChange={handleSwitchChange}
        />
        <ProductSwitch label="Disabled" disabled={true} />
      </div>{" "}
      <div className="flex gap-4">
        <ProductSwitch
          label="Default"
          defaultChecked={true}
          onChange={handleSwitchChange}
          color="gray"
        />
        <ProductSwitch
          label="Checked"
          defaultChecked={true}
          onChange={handleSwitchChange}
          color="gray"
        />
        <ProductSwitch label="Disabled" disabled={true} color="gray" />
      </div>
    </ComponentCard>
  );
}
