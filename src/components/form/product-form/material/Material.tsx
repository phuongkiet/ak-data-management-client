import ComponentCard from '../../../common/ComponentCard.tsx'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../../app/stores/store.ts'
import { useEffect } from 'react'
import ReactSelect from 'react-select'
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

const MaterialGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
  const { materialStore, productStore } = useStore()
  const { loadMaterials, productMaterialList } = materialStore

  useEffect(() => {
    loadMaterials()
  }, [loadMaterials])

  // Mapping list
  const materialOptions: Option[] = productMaterialList.map(material => ({
    value: material.id,
    label: material.name
  }))

  const selectedMaterial = materialOptions.find(
    (option) => option.value === product?.materialId
  )

  return (
    <ComponentCard title="Chất liệu">
      <div className="space-y-6">
        <div>
          <div className="relative">
            <ReactSelect options={materialOptions} value={selectedMaterial} noOptionsMessage={() => "Không có chất liệu"}
            onChange={(selected) => {
              if (!selected) {
                if (onChange) {
                  onChange("materialId", product?.materialId);
                } else if (isCreateMode) {
                  productStore.updateProductForm("materialId", null);
                }
                return;
              }
              if (onChange) {
                onChange("materialId", selected.value);
              } else if (isCreateMode) {
                productStore.updateProductForm("materialId", selected.value);
              }
            }}
             placeholder={'Chọn chất liệu...'} styles={{
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
