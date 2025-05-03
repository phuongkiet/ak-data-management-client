import ComponentCard from "../../../common/ComponentCard.tsx";
import ProductLabel from "../ProductLabel.tsx";
import Input from '../input/ProductInputField.tsx'
import ReactSelect from 'react-select'

interface Option {
  value: number;
  label: string;
}
export default function ProductInputGroup() {

  const options: Option[] = [
    {
      value: 1,
      label: "NHATKHANG-GACH-HCMD5"
    },
    {
      value: 2,
      label: "ANKHANH-TONGHOP-HCMC1"
    },
  ];

  return (
    <ComponentCard title="Nhà cung cấp">
      <div className="space-y-6">
        <div>
          <ProductLabel>Tên nhà cung cấp</ProductLabel>
          <div className="relative">
            <ReactSelect options={options} onChange={() => {
            }} />
          </div>
        </div>
        <div>
          <ProductLabel>Mã nhà cung cấp</ProductLabel>
          <div className="relative">
            <Input placeholder='Tự động điền' disabled value='HCMD5' />
          </div>
        </div>
      </div>
    </ComponentCard>
  );
}
