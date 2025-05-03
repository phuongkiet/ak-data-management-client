import ComponentCard from '../../../common/ComponentCard.tsx'
import ProductLabel from '../ProductLabel.tsx'
import Input from '../input/ProductInputField.tsx'
import { useStore } from '../../../../app/stores/store.ts'
import { useEffect } from 'react'
import ReactSelect from 'react-select'
import { observer } from 'mobx-react-lite'

interface Option {
  value: number;
  label: string;
}

const ColorGroup = () => {
  const { colorStore } = useStore()
  const { loadColors, productColorList } = colorStore


  useEffect(() => {
    loadColors()
  }, [])

  // Mapping list
  const colorOptions: Option[] = productColorList.map(color => ({
    value: color.id,
    label: color.name
  }))

  return (
    <ComponentCard title="Màu gạch">
      <div className="space-y-6">
        <div>
          <ProductLabel>Tên màu</ProductLabel>
          <div className="relative">
            <ReactSelect options={colorOptions} onChange={() => {
            }} placeholder={'Chọn màu gạch...'} styles={{
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
          <ProductLabel>Mã màu</ProductLabel>
          <div className="relative">
            <Input placeholder="Tự động điền" disabled value="Đỏ" />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export default observer(ColorGroup)