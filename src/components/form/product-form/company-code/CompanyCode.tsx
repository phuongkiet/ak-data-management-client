import ReactSelect from 'react-select'
import { useStore } from '../../../../app/stores/store.ts'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { ProductDetail } from '../../../../app/models/product/product.model.ts'

interface Option {
  value: number;
  label: string;
}

interface ProductProps {
  product?: ProductDetail;
  isCreateMode: boolean
}

const CompanyCodeGroup = ({ product, isCreateMode }: ProductProps) => {
  const { companyCodeStore, productStore } = useStore()
  const { loadCompanyCodes, productCompanyCodeList } = companyCodeStore

  useEffect(() => {
    loadCompanyCodes()
  }, [])

  // Mapping list
  const companyCodeOptions: Option[] = productCompanyCodeList.map(companyCode => ({
    value: companyCode.id,
    label: companyCode.codeName
  }))

  const selectedCompanyCode = companyCodeOptions.find(
    (option) => option.value === product?.companyCodeId
  )

  return (
    <div>
      <div className="relative">
        <ReactSelect options={companyCodeOptions}
                     value={selectedCompanyCode}
                     onChange={(selected) => {
                       if (!selected) {
                         productStore.productForm.companyCodeId = 0
                         return
                       }
                       if (isCreateMode) {
                         const companyCodeId = selected?.value
                         productStore.updateProductForm("companyCodeId", companyCodeId)
                       }
                     }}
                     placeholder={'Chọn mã công ty...'}
                     isClearable={true}
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

export default observer(CompanyCodeGroup)
