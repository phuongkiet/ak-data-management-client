import { useEffect } from 'react'
import ReactSelect from 'react-select'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../../app/stores/store.ts'

interface Option {
  value: number;
  label: string;
}

const WaterAbsorptionGroup = () => {
  const { waterAbsorptionStore } = useStore()
  const { loadWaterAbsorption, productWaterAbsorptionList } = waterAbsorptionStore


  useEffect(() => {
    loadWaterAbsorption()
  }, [])

  // Mapping list
  const waterAbsorptionOptions: Option[] = productWaterAbsorptionList.map(waterAbsorption => ({
    value: waterAbsorption.id,
    label: waterAbsorption.waterAbsoprtionLevel
  }))

  return (
        <div>
          <div className="relative">
            <ReactSelect options={waterAbsorptionOptions} onChange={() => {
            }} placeholder={'Chọn...'} styles={{
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

export default observer(WaterAbsorptionGroup)
