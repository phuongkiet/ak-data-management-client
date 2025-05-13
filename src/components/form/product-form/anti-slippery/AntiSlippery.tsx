import { useStore } from '../../../../app/stores/store.ts'
import { useEffect } from 'react'
import ReactSelect from 'react-select'
import { observer } from 'mobx-react-lite'
import { ProductDetail } from '../../../../app/models/product/product.model.ts'

interface Option {
  value: number;
  label: string;
}

interface ProductProps{
  product?: ProductDetail
  isCreateMode: boolean;
  onChange?: (field: string, value: any) => void;
}

const AntiSlipperyGroup = ({product, isCreateMode, onChange}: ProductProps) => {
  const { antiSlipperyStore, productStore } = useStore()
  const { loadAntiSlipperys, productAntiSlipperyList } = antiSlipperyStore


  useEffect(() => {
    loadAntiSlipperys()
  }, [])

  // Mapping list
  const antiSlipperyOptions: Option[] = productAntiSlipperyList.map(antiSlippery => ({
    value: antiSlippery.id,
    label: antiSlippery.antiSlipLevel
  }))

  const selectedAntiSlippery = antiSlipperyOptions.find(
    (option) => option.value === product?.antiSlipLevelId
  )

  return (
    <div>
      <div className="relative">
        <ReactSelect options={antiSlipperyOptions} value={selectedAntiSlippery}
                     onChange={(selected) => {
                        if (!selected) {
                          if (onChange) {
                            onChange("antiSlipId", product?.antiSlipLevelId);
                          } else if (isCreateMode) {
                            productStore.updateProductForm("antiSlipId", null);
                          }
                          return;
                        }
                        if (onChange) {
                          onChange("antiSlipId", selected.value);
                        } else if (isCreateMode) {
                          productStore.updateProductForm("antiSlipId", selected.value);
                        }
                     }}
                     isClearable={true}
                     placeholder={'Chọn độ chống trượt...'} styles={{
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

export default observer(AntiSlipperyGroup)