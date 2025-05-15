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

const OriginGroup = ({product, isCreateMode, onChange}: ProductProps) => {
  const { originStore, productStore } = useStore()
  const { loadOrigins, productOriginList } = originStore


  useEffect(() => {
    loadOrigins()
  }, [])

  // Mapping list
  const originOptions: Option[] = productOriginList.map(origin => ({
    value: origin.id,
    label: origin.name
  }))

  const selectedOrigin = originOptions.find(
    (option) => option.value === product?.originCountryId
  )

  return (
    <div>
      <div className="relative">
        <ReactSelect options={originOptions} value={selectedOrigin}
                     onChange={(selected) => {
                        if(!selected) {
                          if (onChange) {
                            onChange("originCountryId", product?.originCountryId);
                          } else if (isCreateMode) {
                            productStore.updateProductForm("originCountryId", null);
                          }
                          return;
                        }

                        if(isCreateMode) {
                          const originId = selected.value;
                          if (onChange) {
                            onChange("originCountryId", originId);
                          } else if (isCreateMode) {
                            productStore.updateProductForm("originCountryId", originId);
                          }
                        }
                     }}
                     isClearable={true}
                     placeholder={'Chọn xuất xứ...'} noOptionsMessage={() => "Không có xuất xứ"}
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

export default observer(OriginGroup)