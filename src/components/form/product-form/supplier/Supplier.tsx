import ComponentCard from '../../../common/ComponentCard.tsx'
import ProductLabel from '../ProductLabel.tsx'
import Input from '../input/ProductInputField.tsx'
import { useStore } from '../../../../app/stores/store.ts'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import ReactSelect from 'react-select'
import { ProductDetail } from '../../../../app/models/product/product.model.ts' // Đây nè!

interface Option {
  value: number;
  label: string;
}

interface ProductProps {
  product?: ProductDetail;
  isCreateMode: boolean;
}

const SupplierGroup = ({product, isCreateMode}: ProductProps) => {
  const { supplierStore, productStore } = useStore()
  const { loadSuppliers, productSupplierList } = supplierStore
  const { productForm, getNextOrderNumberAuto } = productStore
  const [autoSupplierCode, setAutoSupplierCode] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<Option | null>(null)

  useEffect(() => {
    loadSuppliers();

    if (!isCreateMode && product?.supplierId) {
      productForm.supplierId = product.supplierId;
    }
  }, [isCreateMode, product]);


  // Mapping list
  const supplierOptions: Option[] = productSupplierList.map(supplier => ({
    value: supplier.id,
    label: supplier.supplierName
  }))

  useEffect(() => {
    if (!product?.supplierId || supplierOptions.length === 0) return;

    const selected = supplierOptions.find(option => option.value === product.supplierId) || null;

    // Chỉ set lại nếu khác với current state
    if (selected?.value !== selectedSupplier?.value) {
      setSelectedSupplier(selected);
      setAutoSupplierCode(product?.supplierCode || '');
    }
  }, [product?.supplierId, product?.supplierCode, supplierOptions.length]);


  return (
    <ComponentCard title="Nhà cung cấp">
      <div className="space-y-6">
        <div>
          <ProductLabel>Tên nhà cung cấp</ProductLabel>
          <div className="relative">
            <ReactSelect
              options={supplierOptions}
              value={selectedSupplier}
              onChange={async (selectedOption) => {
                if (!selectedOption) {
                  // Khi người dùng xóa chọn
                  setSelectedSupplier(null)
                  productForm.supplierId = 0 // hoặc null tùy logic backend
                  setAutoSupplierCode('')

                  return
                }

                setSelectedSupplier(selectedOption)
                const supplierId = selectedOption.value
                productForm.supplierId = supplierId
                const supplier = productSupplierList.find(x => x.id === supplierId)
                setAutoSupplierCode(supplier?.supplierCode || '')
                productStore.updateProductForm("supplierId", supplierId)

                if (isCreateMode) {
                  await getNextOrderNumberAuto()
                }
              }}
              placeholder="Chọn nhà cung cấp..."
              isClearable={true}
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
              value={isCreateMode ? autoSupplierCode : product?.supplierCode || ''}
            />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export default observer(SupplierGroup)
