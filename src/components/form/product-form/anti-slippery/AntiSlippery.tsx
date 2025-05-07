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
}

const AntiSlipperyGroup = ({product, isCreateMode}: ProductProps) => {
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
                        if(!selected) {
                          productStore.productForm.antiSlipId = 0
                          return;
                        }

                        if(isCreateMode) {
                          const antiId = selected.value;
                          productStore.updateProductForm("antiSlipId", antiId);
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