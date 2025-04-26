import ComponentCard from "../../../common/ComponentCard.tsx";
import ProductFileInput from "../input/ProductFileInput.tsx";
import ProductLabel from "../ProductLabel.tsx";

export default function ProductFileInputExample() {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };

  return (
    <ComponentCard title="File Input">
      <div>
        <ProductLabel>Upload file</ProductLabel>
        <ProductFileInput onChange={handleFileChange} className="custom-class" />
      </div>
    </ComponentCard>
  );
}
