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
  product?: ProductDetail
  isCreateMode: boolean;
  onChange?: (field: string, value: any) => void;
}

const ProcessingGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
  const { processingStore, productStore } = useStore()
  const { loadProcessings, productProcessingList } = processingStore
  const { productForm } = productStore


  useEffect(() => {
    loadProcessings()
  }, [])

  // Mapping list
  const processingOptions: Option[] = productProcessingList.map(processing => ({
    value: processing.id,
    label: processing.processingCode
  }))

  const selectedProcessing = processingOptions.find(
    (option) => option.value === product?.processingId
  )

  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={processingOptions}
          value={selectedProcessing}
          defaultValue={null}
          onChange={(selected) => {
            if(!selected) {
              if (onChange) {
                onChange("processingId", product?.processingId);
              } else if (isCreateMode) {
                productStore.updateProductForm("processingId", null);
              }
              return;
            }
            if (isCreateMode) {
              const processingId = selected?.value || null
              if (onChange) {
                onChange("processingId", processingId);
              } else if (isCreateMode) {
                productStore.updateProductForm("processingId", processingId);
              }

              productForm.productOrderNumber = 0 
              productForm.productCode = ""
            }
          }}
          placeholder={'Chọn gia công...'}
          isClearable={true}
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
          }} />
      </div>
    </div>
  )
}

export default observer(ProcessingGroup)
