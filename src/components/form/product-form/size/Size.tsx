import ComponentCard from '../../../common/ComponentCard.tsx'
import ProductLabel from '../ProductLabel.tsx'
import Input from '../input/ProductInputField.tsx'
import { useStore } from '../../../../app/stores/store.ts'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import ReactSelect from 'react-select'

interface Option {
  value: number;
  label: string;
}

const SizeGroup = () => {
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

  return (
    <ComponentCard title="Kích thước thực tế">
      <div className="space-y-6">
        <div>
          <ProductLabel>Dài x Rộng</ProductLabel>
          <div className="relative">
            <ReactSelect options={sizeOptions} onChange={() => {
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
          <ProductLabel>Độ dày</ProductLabel>
          <div className="relative">
            <Input type="number" placeholder="9mm" />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export default observer(SizeGroup)