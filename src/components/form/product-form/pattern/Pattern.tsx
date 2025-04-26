import ComponentCard from "../../../common/ComponentCard.tsx";
import ProductLabel from "../ProductLabel.tsx";
import Input from '../input/ProductInputField.tsx'
import PatternSelect from './PatternSelect.tsx'

interface Option {
  value: number;
  label: string;
}
export default function PatternGroup() {

  const options: Option[] = [
    {
      value: 1,
      label: "Stone"
    },
    {
      value: 2,
      label: "Marble"
    },
  ];

  return (
    <ComponentCard title="Hệ vân gạch">
      <div className="space-y-6">
        <div>
          <ProductLabel>Tên hệ vân</ProductLabel>
          <div className="relative">
            <PatternSelect options={options} onChange={() => {
            }} />
          </div>
        </div>
        <div>
          <ProductLabel>Mã ngắn hệ vân</ProductLabel>
          <div className="relative">
            <Input placeholder='Tự động điền' disabled value='HCMD5' />
          </div>
        </div>
      </div>
    </ComponentCard>
  );
}
