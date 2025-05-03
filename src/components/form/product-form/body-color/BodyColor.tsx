import { useStore } from '../../../../app/stores/store.ts'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import ReactSelect from 'react-select'

interface Option {
  value: number;
  label: string;
}

const BodyColorGroup = () => {
  const { colorStore } = useStore()
  const { loadColors, productColorList } = colorStore


  useEffect(() => {
    loadColors()
  }, [])

  // Mapping list
  const bodyColorOptions: Option[] = productColorList.map(bodyColor => ({
    value: bodyColor.id,
    label: bodyColor.name
  }))

  return (
        <div>
          <div className="relative">
            <ReactSelect options={bodyColorOptions} onChange={() => {
            }} placeholder={"Chọn màu thân gạch..."} styles={{
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
  )
}

export default observer(BodyColorGroup)