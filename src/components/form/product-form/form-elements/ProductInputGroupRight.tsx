import ComponentCard from "../../../common/ComponentCard.tsx";
import ProductLabel from "../ProductLabel.tsx";
import Input from "../input/ProductInputField.tsx";
import ProductSwitch from '../switch/ProductSwitch.tsx'
import AntiSlipperyGroup from '../anti-slippery/AntiSlippery.tsx'
import OriginGroup from '../origin/Origin.tsx'
import BodyColorGroup from '../body-color/BodyColor.tsx'
import WaterAbsorptionGroup from '../water-absorption/WaterAbsorption.tsx'

export default function ProductInputGroupRight() {

  return (
    <ComponentCard title="Thông tin khác">
      <div className='grid grid-cols-1 gap-6'>
        <div className='space-y-6'>
          <ProductLabel htmlFor="input">Tình trạng sản phẩm và website</ProductLabel>
          <WaterAbsorptionGroup />
        </div>
      </div>
      <div className='grid grid-cols-2 gap-6'>
        <div className="space-y-6">
          <div>
            <ProductLabel htmlFor="input">Xác định giá</ProductLabel>
            <WaterAbsorptionGroup />
          </div>
          <div>
            <ProductLabel htmlFor="input">Độ hút nước</ProductLabel>
            <WaterAbsorptionGroup />
          </div>
          <div>
            <ProductLabel htmlFor="input">Trong nhà</ProductLabel>
            <ProductSwitch label="Có" onChange={() => {
            }} color="blue" />
          </div>
          <div>
            <ProductLabel htmlFor="input">Lát nền</ProductLabel>
            <ProductSwitch label="Có" onChange={() => {
            }} color="blue" />
          </div>
          <div>
            <ProductLabel htmlFor="input">CO-CQ</ProductLabel>
            <ProductSwitch label="Có" onChange={() => {
            }} color="blue" />
          </div>
          <div>
            <ProductLabel htmlFor="input">Chống bám bẩn</ProductLabel>
            <ProductSwitch label="Có" onChange={() => {
            }} color="blue" />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <ProductLabel htmlFor="input">Thông báo website</ProductLabel>
            <WaterAbsorptionGroup />
          </div>
          <div>
            <ProductLabel htmlFor="input">Random</ProductLabel>
            <Input type="number" id="input" placeholder="Số random" />
          </div>
          <div>
            <ProductLabel htmlFor="input">Ngoài trời</ProductLabel>
            <ProductSwitch label="Có" onChange={() => {
            }} color="blue" />
          </div>
          <div>
            <ProductLabel htmlFor="input">Ốp tường</ProductLabel>
            <ProductSwitch label="Có" onChange={() => {
            }} color="blue" />
          </div>
          <div>
            <ProductLabel htmlFor="input">Chống trầy</ProductLabel>
            <ProductSwitch label="Có" onChange={() => {
            }} color="blue" />
          </div>
          <div>
            <ProductLabel htmlFor="input">Mài cạnh</ProductLabel>
            <ProductSwitch label="Có" onChange={() => {
            }} color="blue" />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <ProductLabel htmlFor="input">Độ cứng Mohs</ProductLabel>
        <Input type="number" id="input" placeholder="Độ cứng Mohs" />
      </div>
      <div>
        <ProductLabel htmlFor="input">Độ chống trượt</ProductLabel>
        <AntiSlipperyGroup/>
      </div>
      <div>
        <ProductLabel htmlFor="input">Xuất xứ</ProductLabel>
        <OriginGroup/>
      </div>
      <div>
        <ProductLabel htmlFor="input">Màu thân gạch</ProductLabel>
        <BodyColorGroup/>
      </div>
    </ComponentCard>
  );
}
