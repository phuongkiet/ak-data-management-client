import ComponentCard from '../../../common/ComponentCard.tsx'
import ProductLabel from '../ProductLabel.tsx'
import Input from '../input/ProductInputField.tsx'
import { useStore } from '../../../../app/stores/store.ts'
import { useEffect, useState } from 'react'
import ReactSelect from 'react-select'
import { ProductPatternDto } from '../../../../app/models/product/productPattern.model.ts'
import { observer } from 'mobx-react-lite'

interface Option {
  value: number;
  label: string;
}

const PatternGroup = () => {
  const { patternStore } = useStore()
  const { loadPatterns, productPatternList } = patternStore
  const [selectedPattern, setSelectedPattern] = useState<ProductPatternDto | null>(null)


  useEffect(() => {
    loadPatterns()
  }, [])

  // Mapping list
  const patternOptions: Option[] = productPatternList.map(pattern => ({
    value: pattern.id,
    label: pattern.name
  }))

  return (
    <ComponentCard title="Hệ vân gạch">
      <div className="space-y-6">
        <div>
          <ProductLabel>Tên hệ vân</ProductLabel>
          <div className="relative">
            <ReactSelect options={patternOptions}
                         onChange={(selectedOption) => {
                           const patternId = selectedOption ? selectedOption.value : null
                           const pattern = productPatternList.find(x => x.id === patternId) || null
                           setSelectedPattern(pattern)
                         }}
                         placeholder={'Chọn hệ vân...'}
                         className="react-select-container"
                         classNamePrefix="react-select"
                         styles={{
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
                         }}
            />
          </div>
        </div>
        <div>
          <ProductLabel>Mã ngắn hệ vân</ProductLabel>
          <div className="relative">
            <Input placeholder="Tự động điền" disabled value={selectedPattern?.shortCode || ''} />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export default observer(PatternGroup)