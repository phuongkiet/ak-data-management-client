import ComponentCard from '../../../common/ComponentCard.tsx'
import ProductLabel from '../ProductLabel.tsx'
import Input from '../input/ProductInputField.tsx'
import { useStore } from '../../../../app/stores/store.ts'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { ProductSupplierDto } from '../../../../app/models/product/productSupplier.model.ts'
import ReactSelect from 'react-select' // Đây nè!

interface Option {
  value: number;
  label: string;
}

const SupplierGroup = () => {
  const { supplierStore } = useStore()
  const { loadSuppliers, productSupplierList } = supplierStore

  const [selectedSupplier, setSelectedSupplier] = useState<ProductSupplierDto | null>(null)

  useEffect(() => {
    loadSuppliers()
  }, [])

  // Mapping list
  const supplierOptions: Option[] = productSupplierList.map(supplier => ({
    value: supplier.id,
    label: supplier.supplierName
  }))

  return (
    <ComponentCard title="Nhà cung cấp">
      <div className="space-y-6">
        <div>
          <ProductLabel>Tên nhà cung cấp</ProductLabel>
          <div className="relative">
            <ReactSelect
              options={supplierOptions}
              onChange={(selectedOption) => {
                const supplierId = selectedOption ? selectedOption.value : null
                const supplier = productSupplierList.find(x => x.id === supplierId) || null
                setSelectedSupplier(supplier)
              }}
              placeholder="Chọn nhà cung cấp..."
              className="react-select-container"
              classNamePrefix="react-select"
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
              }}
            />
          </div>
        </div>
        <div>
          <ProductLabel>Mã nhà cung cấp</ProductLabel>
          <div className="relative">
            <Input
              placeholder="Tự động điền"
              disabled
              value={selectedSupplier?.supplierCode || ''}
            />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export default observer(SupplierGroup)
