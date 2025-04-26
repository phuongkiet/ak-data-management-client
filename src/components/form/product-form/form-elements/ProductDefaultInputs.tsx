import ComponentCard from "../../../common/ComponentCard.tsx";
import ProductLabel from "../ProductLabel.tsx";
import Input from "../input/ProductInputField.tsx";
import SupplierSelect from '../supplier/SupplierSelect.tsx'

export default function ProductDefaultInputs() {

  const options = [
    {
      value: 1, label: "LT"
    },
    {
      value: 2, label: "LB"
    },
  ]
  return (
    <ComponentCard title="Thông tin mã hàng">
      <div className="space-y-6">
        <div>
          <ProductLabel htmlFor="input">Mã số nhà cung cấp</ProductLabel>
          <Input type="text" id="input" />
        </div>
        <div>
          <ProductLabel>Gia công khác</ProductLabel>
          <SupplierSelect options={options} placeholder="Lựa chọn..." onChange={() => {
          }}></SupplierSelect>
        </div>
        <div>
          <ProductLabel htmlFor="input">Mã hàng nhà cung cấp</ProductLabel>
          <Input type="text" id="input" disabled placeholder="Ô tự động điền" />
        </div>
        <div>
          <ProductLabel htmlFor="input">Code mã hàng chính</ProductLabel>
          <Input type="text" id="input" disabled placeholder="Ô tự động điền" />
        </div>
        <div>
          <ProductLabel htmlFor="input">Mã sản phẩm SAPO</ProductLabel>
          <Input type="text" id="input" disabled placeholder="Ô tự động điền" />
        </div>
        <div>
          <ProductLabel htmlFor="input">Mã sản phẩm website</ProductLabel>
          <Input type="text" id="input" disabled placeholder="Ô tự động điền" />
        </div>
        <div>
          <ProductLabel htmlFor="input">Giá sản phẩm website</ProductLabel>
          <Input type="number" id="input" placeholder="Nhập giá..." />
        </div>
        <div>
          <ProductLabel htmlFor="input">Giá khuyến mãi</ProductLabel>
          <Input type="number" id="input" placeholder="Nhập giá khuyến mãi..." />
        </div>
      </div>
    </ComponentCard>
  );
}
