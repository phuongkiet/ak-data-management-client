import ComponentCard from '../../../common/ComponentCard.tsx'
import ProductLabel from '../ProductLabel.tsx'
import Input from '../input/ProductInputField.tsx'
import { useStore } from '../../../../app/stores/store.ts'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import ReactSelect from 'react-select'
import { ProductDetail } from '../../../../app/models/product/product.model.ts'

interface Option {
  value: number;
  label: string;
}

interface ProductProps {
  product?: ProductDetail;
  isCreateMode: boolean;
}

const SizeGroup = ({product, isCreateMode}: ProductProps) => {
  const { sizeStore } = useStore()
  const { loadSizes, productSizeList } = sizeStore


  useEffect(() => {
    loadSizes()
  }, [])

  // Mapping list
  const sizeOptions: Option[] = productSizeList.map(size => ({
    value: size.id,
    label: size.autoSized
  }))

  const selectedSize = sizeOptions.find(
    (option) => option.value === product?.actualSizeId
  )
  return (
    <ComponentCard title="Kích thước thực tế">
      <div className="space-y-6">
        <div>
          <ProductLabel>Dài x Rộng</ProductLabel>
          <div className="relative">
            <ReactSelect options={sizeOptions} value={selectedSize} onChange={() => {
            }} placeholder={'Chọn kích thước...'} styles={{
              control: (base) => ({
                ...base,
                minHeight: '44px', // Chiều cao tổng thể
                height: '44px',
                fontFamily: 'Roboto, sans-serif',
                fontSize: '14px'
              }),
              valueContainer: (base) => ({
                ...base,
                height: '44px',
                padding: '0 8px'
              }),
              indicatorsContainer: (base) => ({
                ...base,
                height: '44px'
              }),
              option: (base, state) => ({
                ...base,
                fontFamily: 'Roboto, sans-serif',
                backgroundColor: state.isFocused ? '#f3f4f6' : 'white',
                color: 'black'
              })
            }} />
          </div>
        </div>
        <div>
          <ProductLabel>Độ dày (mm)</ProductLabel>
          {isCreateMode ? (
            <div className="relative">
              <Input type="number" placeholder="9mm" value={''} />
            </div>
          ) : (
            <div className="relative">
              <Input type="number" placeholder="9mm" value={product?.thicknessSize} />
            </div>
          )}
        </div>
      </div>
    </ComponentCard>
  )
}

export default observer(SizeGroup)