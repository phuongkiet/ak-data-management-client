import { useStore } from '../../../../app/stores/store.ts'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import ReactSelect from 'react-select'

interface Option {
  value: number;
  label: string;
}

const ProcessingGroup = () => {
  const { processingStore } = useStore()
  const { loadProcessings, productProcessingList } = processingStore


  useEffect(() => {
    loadProcessings()
  }, [])

  // Mapping list
  const processingOptions: Option[] = productProcessingList.map(processing => ({
    value: processing.id,
    label: processing.processingCode
  }))

  return (
    <div>
      <div className="relative">
        <ReactSelect options={processingOptions} onChange={() => {
        }} placeholder={'Chọn gia công...'} styles={{
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

export default observer(ProcessingGroup)
