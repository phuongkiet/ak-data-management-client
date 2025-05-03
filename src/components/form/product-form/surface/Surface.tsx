import ComponentCard from '../../../common/ComponentCard.tsx'
import { useStore } from '../../../../app/stores/store.ts'
import { useEffect } from 'react'
import ReactSelect from 'react-select'
import { observer } from 'mobx-react-lite'

interface Option {
  value: number;
  label: string;
}

const SurfaceGroup = () => {
  const { surfaceStore } = useStore()
  const { loadSurfaces, productSurfaceList } = surfaceStore


  useEffect(() => {
    loadSurfaces()
  }, [])

  // Mapping list
  const surfaceOptions: Option[] = productSurfaceList.map(surface => ({
    value: surface.id,
    label: surface.name
  }))

  return (
    <ComponentCard title="Bề mặt">
      <div className="space-y-6">
        <div>
          <div className="relative">
            <ReactSelect options={surfaceOptions} onChange={() => {
            }} placeholder={'Chọn bề mặt...'} styles={{
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

export default observer(SurfaceGroup)
