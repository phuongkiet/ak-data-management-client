import { useStore } from '../../../../app/stores/store.ts'
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
  const { productStore, processingStore } = useStore()
  const { productForm } = productStore
  const { productProcessingList } = processingStore


  // Mapping list
  const processingOptions: Option[] = productProcessingList.map(processing => ({
    value: processing.id,
    label: processing.processingCode
  }))

  // Ensure processingId is always an array
  const selectedProcessings = processingOptions.filter(option =>
    Array.isArray(isCreateMode ? productForm.productProcessingId : product?.productProcessingId)
      ? (isCreateMode ? productForm.productProcessingId : product?.productProcessingId)?.includes(option.value)
      : false
  )

  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={processingOptions}
          value={selectedProcessings}
          isMulti
          noOptionsMessage={() => "Không có gia công"}
          onChange={(selected) => {
            const ids = selected ? selected.map((s: Option) => s.value) : [];
            if (onChange) {
              onChange("productProcessingId", ids);
            } else if (isCreateMode) {
              productStore.updateProductForm("productProcessingId", ids);
            }
          }}
          placeholder={'Chọn gia công...'}
          isClearable={true}
          closeMenuOnSelect={false}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: '44px',
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
  )
}

export default observer(ProcessingGroup)
