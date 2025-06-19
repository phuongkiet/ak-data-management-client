import { useStore } from '../../../../app/stores/store.ts'
import { observer } from 'mobx-react-lite'
import ReactSelect from 'react-select'
import { ProductDetail } from '../../../../app/models/product/product.model.ts'
import { useTheme } from '../../../../app/context/ThemeContext.tsx'

interface Option {
  value: number;
  label: string;
  description: string;
}

interface ProductProps {
  product?: ProductDetail
  isCreateMode: boolean;
  onChange?: (field: string, value: any) => void;
}

const ProcessingGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
  const { theme } = useTheme();
  const { productStore, processingStore } = useStore()
  const { productForm } = productStore
  const { productProcessingList } = processingStore


  // Mapping list
  const processingOptions: Option[] = productProcessingList.map(processing => ({
    value: processing.id,
    label: processing.processingCode,
    description: processing.processingDescription || ""
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
          formatOptionLabel={(option) => (
            <div>
              <div>{option.label}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{option.description}</div>
            </div>
          )}
          placeholder={'Chọn gia công...'}
          isClearable={true}
          closeMenuOnSelect={false}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: "44px",
              height: "44px",
              fontFamily: "Roboto, sans-serif",
              fontSize: "14px",
              backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
              color: theme === 'dark' ? '#fff' : base.color,
              borderColor: theme === 'dark' ? '#384052' : base.borderColor,
              border: theme === 'dark' ? '1px solid #384052' : '1px solid #e5e7eb',
            }),
            valueContainer: (base) => ({
              ...base,
              height: "44px",
              padding: "0 8px",
              backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
              color: theme === 'dark' ? '#fff' : base.color,
            }),
            indicatorsContainer: (base) => ({
              ...base,
              height: "44px",
              backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
            }),
            option: (base, state) => ({
              ...base,
              fontFamily: "Roboto, sans-serif",
              backgroundColor: state.isFocused
                ? (theme === 'dark' ? '#23232b' : '#f3f4f6')
                : (theme === 'dark' ? '#131827' : 'white'),
              color: theme === 'dark' ? '#fff' : 'black',
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
              color: theme === 'dark' ? '#fff' : base.color,
            }),
            singleValue: (base) => ({
              ...base,
              color: theme === 'dark' ? '#fff' : base.color,
            }),
            input: (base) => ({
              ...base,
              color: theme === 'dark' ? '#fff' : base.color,
            }),
          }}
        />
      </div>
    </div>
  )
}

export default observer(ProcessingGroup)
