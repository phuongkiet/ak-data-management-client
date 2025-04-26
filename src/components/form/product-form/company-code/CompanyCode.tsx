import ComponentCard from "../../../common/ComponentCard.tsx";
import ProductLabel from "../ProductLabel.tsx";
import SupplierSelect from '../supplier/SupplierSelect.tsx'

interface Option {
  value: number;
  label: string;
}
export default function CompanyCodeGroup() {

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
    <ComponentCard title="Mã công ty">
      <div className="space-y-6">
        <div>
          <ProductLabel>Mã công ty</ProductLabel>
          <div className="relative">
            <SupplierSelect options={options} onChange={() => {
            }} />
          </div>
        </div>
      </div>
    </ComponentCard>
  );
}
