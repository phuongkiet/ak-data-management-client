import ComponentCard from "../../../common/ComponentCard.tsx";
import ProductLabel from "../ProductLabel.tsx";
import Input from '../input/ProductInputField.tsx'
import SizeSelect from './SizeSelect.tsx'

interface Option {
  value: number;
  label: string;
}
export default function SizeGroup() {

  const options: Option[] = [
    {
      value: 1,
      label: "30x60 cm"
    },
    {
      value: 2,
      label: "60x60 cm"
    },
  ];

  return (
    <ComponentCard title="Kích thước thực tế">
      <div className="space-y-6">
        <div>
          <ProductLabel>Dài x Rộng</ProductLabel>
          <div className="relative">
            <SizeSelect options={options} onChange={() => {
            }} />
          </div>
        </div>
        <div>
          <ProductLabel>Độ dày</ProductLabel>
          <div className="relative">
            <Input type='number' placeholder='9mm' />
          </div>
        </div>
      </div>
    </ComponentCard>
  );
}
