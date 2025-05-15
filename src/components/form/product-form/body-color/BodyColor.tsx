import { useStore } from '../../../../app/stores/store.ts'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import ReactSelect from 'react-select'
import { ProductDetail } from '../../../../app/models/product/product.model.ts'

interface Option {
  value: number;
  label: string;
}

interface ProductProps{
  product?: ProductDetail;
  isCreateMode: boolean;
  onChange?: (field: string, value: any) => void;
}

const BodyColorGroup = ({product, isCreateMode, onChange}: ProductProps) => {
  const { bodyColorStore, productStore } = useStore()
  const { loadBodyColors, productBodyColorList } = bodyColorStore


  useEffect(() => {
    loadBodyColors()
  }, [])

  // Mapping list
  const bodyColorOptions: Option[] = productBodyColorList.map(bodyColor => ({
    value: bodyColor.id,
    label: bodyColor.name
  }))

  const selectedBodyColor = bodyColorOptions.find(
    (option) => option.value === product?.brickBodyId
  )

  return (
        <div>
          <div className="relative">
            <ReactSelect options={bodyColorOptions}
                         value={selectedBodyColor}
                         noOptionsMessage={() => "Không có màu thân gạch"}
                         onChange={(selected) => {
                            if(!selected) {
                              if (onChange) {
                                onChange("brickBodyId", product?.brickBodyId);
                              } else if (isCreateMode) {
                                productStore.updateProductForm("brickBodyId", null);
                              }
                              return;
                            }

                            if(isCreateMode) {
                              const bodyColorId = selected.value;
                              if (onChange) {
                                onChange("brickBodyId", bodyColorId);
                              } else if (isCreateMode) {
                                productStore.updateProductForm("brickBodyId", bodyColorId);
                              }
                            }
                         }}
                         isClearable={true}
                         placeholder={"Chọn màu thân gạch..."}
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

export default observer(BodyColorGroup)