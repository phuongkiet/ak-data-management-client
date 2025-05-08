import ComponentCard from '../../../common/ComponentCard.tsx'
import ProductLabel from '../ProductLabel.tsx'
import Input from '../input/ProductInputField.tsx'
import ProductSwitch from '../switch/ProductSwitch.tsx'
import AntiSlipperyGroup from '../anti-slippery/AntiSlippery.tsx'
import OriginGroup from '../origin/Origin.tsx'
import BodyColorGroup from '../body-color/BodyColor.tsx'
import WaterAbsorptionGroup from '../water-absorption/WaterAbsorption.tsx'
import { ProductDetail } from '../../../../app/models/product/product.model.ts'
import UploadWebsiteStatus from '../upload-status/UploadWebsiteStatus.tsx'
import NoticeDataWebsite from '../notice-data/NoticeDataWebsite.tsx'
import PriceDetermination from '../price-determination/PriceDetermination.tsx'
import { useStore } from '../../../../app/stores/store.ts'
import { useState } from 'react'

interface ProductProps {
  product?: ProductDetail;
  isCreateMode: boolean
}

export default function ProductInputGroupRight({ product, isCreateMode }: ProductProps) {
  const { productStore } = useStore()
  const [ patternNumber, setPatternNumber ] = useState<number>()
  const [ mohsHardness, setMohsHardness ] = useState<number>()

  const handlePatternQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const newValue = parseInt(value, 10)
    setPatternNumber(newValue);
    productStore.updateProductForm('patternQuantity', newValue)
  }

  const handleMohsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const newValue = parseInt(value, 10)
    setMohsHardness(newValue);
    productStore.updateProductForm('hardnessMOHS', newValue)
  }

  return (
    <ComponentCard title="Thông tin khác">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <ProductLabel htmlFor="input">Tình trạng sản phẩm và website</ProductLabel>
          <UploadWebsiteStatus product={product} isCreateMode={isCreateMode} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <ProductLabel htmlFor="input">Xác định giá</ProductLabel>
            <PriceDetermination product={product} isCreateMode={isCreateMode}/>
          </div>
          <div>
            <ProductLabel htmlFor="input">Độ hút nước</ProductLabel>
            <WaterAbsorptionGroup product={product} isCreateMode={isCreateMode}/>
          </div>
          <div>
            <ProductLabel htmlFor="input">Trong nhà</ProductLabel>
            <ProductSwitch
              label="Có"
              defaultChecked={isCreateMode ? false : product?.isInside}
              onChange={(checked) => {
                productStore.updateProductForm('isInside', checked)
              }}
              color="blue"
            />
          </div>
          <div>
            <ProductLabel htmlFor="input">Lát nền</ProductLabel>
            <ProductSwitch label="Có"
                           defaultChecked={isCreateMode ? false : product?.isFlooring}
                           onChange={(checked) => {
                             productStore.updateProductForm('isFlooring', checked)
                           }}
                           color="blue" />
          </div>
          <div>
            <ProductLabel htmlFor="input">CO-CQ</ProductLabel>
            <ProductSwitch label="Có" defaultChecked={isCreateMode ? false : product?.isCOCQ} onChange={(checked) => {
              productStore.updateProductForm('isCOCQ', checked)
            }} color="blue" />
          </div>
          <div>
            <ProductLabel htmlFor="input">Chống bám bẩn</ProductLabel>
            <ProductSwitch label="Có" defaultChecked={isCreateMode ? false : product?.isAntiFouling}
                           onChange={(checked) => {
                             productStore.updateProductForm('isAntiFouling', checked)
                           }} color="blue" />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <ProductLabel htmlFor="input">Thông báo website</ProductLabel>
            <NoticeDataWebsite product={product} isCreateMode={isCreateMode}/>
          </div>
          <div>
            <ProductLabel htmlFor="input">Random</ProductLabel>
            <Input type="number" id="input" placeholder="Số random" value={
              isCreateMode
                ? patternNumber
                : product?.patternQuantity !== undefined && product?.patternQuantity !== null
                  ? product.patternQuantity
                  : ''
            }
                   onChange={handlePatternQuantityChange} />
          </div>
          <div>
            <ProductLabel htmlFor="input">Ngoài trời</ProductLabel>
            <ProductSwitch label="Có" defaultChecked={isCreateMode ? false : product?.isOutside}
                           onChange={(checked) => {
                             productStore.updateProductForm('isOutside', checked)
                           }} color="blue" />
          </div>
          <div>
            <ProductLabel htmlFor="input">Ốp tường</ProductLabel>
            <ProductSwitch label="Có" defaultChecked={isCreateMode ? false : product?.isWalling}
                           onChange={(checked) => {
                             productStore.updateProductForm('isWalling', checked)
                           }} color="blue" />
          </div>
          <div>
            <ProductLabel htmlFor="input">Chống trầy</ProductLabel>
            <ProductSwitch label="Có" defaultChecked={isCreateMode ? false : product?.isScratchResist}
                           onChange={(checked) => {
                             productStore.updateProductForm('isScratchResist', checked)
                           }} color="blue" />
          </div>
          <div>
            <ProductLabel htmlFor="input">Mài cạnh</ProductLabel>
            <ProductSwitch label="Có" defaultChecked={product?.isEdgeGrinding} onChange={(checked) => {
              productStore.updateProductForm('isEdgeGrinding', checked)
            }} color="blue" />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <ProductLabel htmlFor="input">Độ cứng Mohs</ProductLabel>
        <Input
          type="number"
          id="input"
          placeholder="Độ cứng Mohs"
          value={
            isCreateMode
              ? mohsHardness
              : product?.hardnessMOHS !== undefined && product?.hardnessMOHS !== null
                ? product.hardnessMOHS
                : ''
          }
          onChange={handleMohsChange}
        />
      </div>
      <div>
        <ProductLabel htmlFor="input">Độ chống trượt</ProductLabel>
        <AntiSlipperyGroup product={product} isCreateMode={isCreateMode} />
      </div>
      <div>
        <ProductLabel htmlFor="input">Xuất xứ</ProductLabel>
        <OriginGroup product={product} isCreateMode={isCreateMode} />
      </div>
      <div>
        <ProductLabel htmlFor="input">Màu thân gạch</ProductLabel>
        <BodyColorGroup product={product} isCreateMode={isCreateMode} />
      </div>
    </ComponentCard>
  )
}
