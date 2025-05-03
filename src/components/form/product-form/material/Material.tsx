import ComponentCard from '../../../common/ComponentCard.tsx'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../../app/stores/store.ts'
import { useEffect } from 'react'
import ReactSelect from 'react-select'

interface Option {
  value: number;
  label: string;
}

const MaterialGroup = () => {
  const { materialStore } = useStore()
  const { loadMaterials, productMaterialList } = materialStore


  useEffect(() => {
    loadMaterials()
  }, [])

  // Mapping list
  const materialOptions: Option[] = productMaterialList.map(material => ({
    value: material.id,
    label: material.name
  }))

  return (
    <ComponentCard title="Chất liệu">
      <div className="space-y-6">
        <div>
          <div className="relative">
            <ReactSelect options={materialOptions} onChange={() => {
            }} placeholder={'Chọn chất liệu...'} styles={{
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
      </div>
    </ComponentCard>
  )
}

export default observer(MaterialGroup)
