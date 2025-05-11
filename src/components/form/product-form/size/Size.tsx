import ComponentCard from '../../../common/ComponentCard.tsx'
import ProductLabel from '../ProductLabel.tsx'
import Input from '../input/ProductInputField.tsx'
import { useStore } from '../../../../app/stores/store.ts'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import ReactSelect from 'react-select'
import { ProductDetail } from '../../../../app/models/product/product.model.ts'
import * as yup from 'yup';

interface Option {
  value: number;
  label: string;
}

interface SizeGroupProps {
  product?: ProductDetail;
  isCreateMode: boolean;
  thicknessError: string;
  setThicknessError: (err: string) => void;
}

const thicknessSchema = yup
  .number()
  .typeError('Độ dày phải là số')
  .required('Độ dày là bắt buộc')
  .min(1, 'Độ dày tối thiểu là 1mm')
  .max(100, 'Độ dày tối đa là 100mm');

const SizeGroup = ({product, isCreateMode, thicknessError, setThicknessError}: SizeGroupProps) => {
  const { sizeStore, productStore } = useStore()
  const { loadSizes, productSizeList } = sizeStore
  const [thickness, setThickness] = useState<string>(product?.thicknessSize?.toString() || '')

  useEffect(() => {
    loadSizes()
  }, [])

  // Mapping list
  const sizeOptions: Option[] = productSizeList.map(size => ({
    value: size.id,
    label: size.autoSized
  }))

  const selectedSize = sizeOptions.find(
    (option) => option.value === (isCreateMode ? productStore.productForm.actualSizeId : product?.actualSizeId)
  )

  const handleSizeChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      productStore.updateProductForm('actualSizeId', selectedOption.value)
    }
  }

  const handleThicknessChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setThickness(value)
    const numericValue = value ? parseFloat(value) : 0
    productStore.updateProductForm('thicknessSize', numericValue)
    try {
      await thicknessSchema.validate((numericValue === undefined ? '' : numericValue) as unknown)
      setThicknessError('')
    } catch (err: any) {
      setThicknessError(err.message)
    }
  }

  return (
    <ComponentCard title="Kích thước thực tế">
      <div className="space-y-6">
        <div>
          <ProductLabel>Dài x Rộng</ProductLabel>
          <div className="relative">
            <ReactSelect 
              options={sizeOptions} 
              value={selectedSize} 
              onChange={handleSizeChange}
              placeholder={'Chọn kích thước...'} 
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
        <div>
          <ProductLabel>Độ dày (mm)</ProductLabel>
          <div className="relative">
            <Input 
              type="number" 
              placeholder="9mm" 
              value={isCreateMode ? thickness : product?.thicknessSize} 
              onChange={isCreateMode ? handleThicknessChange : undefined}
              error={!!thicknessError}
              hint={thicknessError}
            />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export default observer(SizeGroup)