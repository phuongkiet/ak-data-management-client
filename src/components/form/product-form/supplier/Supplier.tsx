import ComponentCard from "../../../common/ComponentCard.tsx";
import ProductLabel from "../ProductLabel.tsx";
import SupplierSelect from '../supplier/SupplierSelect.tsx'
import Input from '../input/ProductInputField.tsx'

interface Option {
  value: number;
  label: string;
}
export default function SupplierGroup() {

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
            <SupplierSelect options={options} onChange={() => {
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
