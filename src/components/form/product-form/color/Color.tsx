import ComponentCard from '../../../common/ComponentCard.tsx'
import ProductLabel from '../ProductLabel.tsx'
import Input from '../input/product/ProductInputField.tsx'
import { useStore } from '../../../../app/stores/store.ts'
import { useEffect, useState } from 'react'
import ReactSelect from 'react-select'
import { observer } from 'mobx-react-lite'
import { ProductDetail } from '../../../../app/models/product/product.model.ts'

interface Option {
  value: number;
  label: string;
}

interface ProductProps {
  product?: ProductDetail;
  isCreateMode: boolean;
  onChange?: (field: string, value: any) => void;
}

const ColorGroup = ({product, isCreateMode, onChange}: ProductProps) => {
  const { colorStore, productStore } = useStore()
  const { loadColors, productColorList } = colorStore
  const [hexColor, setHexColor] = useState<string>("")

  useEffect(() => {
    loadColors()
  }, [])

  // Mapping list
  const colorOptions: Option[] = productColorList.map(color => ({
    value: color.id,
    label: color.name
  }))

  const selectedColor = colorOptions.find(
    (option) => option.value === product?.colorId
  )

  const getSelectedColorHex = () => {
    if (isCreateMode) {
      const color = productColorList.find(c => c.id === productStore.productForm.colorId);
      console.log(color?.id)
      return color?.colorHexCode || "#ffffff";
    } else {
      const color = productColorList.find(c => c.id === product?.colorId);
      return color?.colorHexCode || "#ffffff";
    }
  }

  const getTextColorClass = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white text for dark backgrounds, black for light backgrounds
    return luminance > 0.5 ? 'text-gray-900' : 'text-white';
  }

  return (
    <ComponentCard title="Màu gạch">
      <div className="space-y-6">
        <div>
          <ProductLabel>Tên màu</ProductLabel>
          <div className="relative">
            <ReactSelect options={colorOptions} value={selectedColor} noOptionsMessage={() => "Không có màu gạch"}
            onChange={(selected) => {
              if(!selected){
                if (onChange) {
                  onChange("colorId", product?.colorId);
                } else if (isCreateMode) {
                  productStore.updateProductForm("colorId", null);
                }
                setHexColor("")
                return;
              }

              if (onChange) {
                onChange("colorId", selected.value);
              } else if (isCreateMode) {
                productStore.updateProductForm("colorId", selected.value);
                const color = productColorList.find(c => c.id === selected.value);
                setHexColor(color?.colorHexCode || "")
                console.log('Selected color:', color?.id, color?.colorHexCode);
              }
            }}
             placeholder={'Chọn màu gạch...'} styles={{
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
            }} />
          </div>
        </div>
        {isCreateMode ? (
          <div>
            <ProductLabel>Mã màu</ProductLabel>
            <div className="w-full">
              <Input 
                placeholder="Tự động điền" 
                value={hexColor} 
                className={`w-full ${getTextColorClass(hexColor || '#ffffff')}`}
                style={{ backgroundColor: hexColor || '#ffffff' }}
              />
            </div>
          </div>
        ) : (
          <div>
            <ProductLabel>Mã màu</ProductLabel>
            <div className="w-full">
              <Input 
                placeholder="Tự động điền" 
                value={getSelectedColorHex()} 
                className={`w-full ${getTextColorClass(getSelectedColorHex())}`}
                style={{ backgroundColor: getSelectedColorHex() }}
              />
            </div>
          </div>
        )}
      </div>
    </ComponentCard>
  )
}

export default observer(ColorGroup)