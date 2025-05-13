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
  isCreateMode: boolean;
  onChange?: (field: string, value: any) => void;
}

const CompanyCodeGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
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

  const handleCompanyCodeChange = (selected: Option | null) => {
    if (!selected) {
      if (onChange) {
        onChange("companyCodeId", null);
        onChange("confirmSupplierItemCode", ""); // Clear SKU when company code is cleared
      } else if (isCreateMode) {
        productStore.updateProductForm("companyCodeId", null);
        // productStore.updateProductForm("confirmSupplierItemCode", ""); // Clear SKU when company code is cleared
      }
      return;
    }

    const companyCodeId = selected.value;
    const companyCode = productCompanyCodeList.find(x => x.id === companyCodeId);
    
    if (companyCode?.codeName) {
      // Get the current code and extract everything after the first space
      const currentCode = product?.confirmSupplierItemCode || "";
      const codeAfterSpace = currentCode.includes(' ') ? currentCode.substring(currentCode.indexOf(' ') + 1) : "";
      
      // Create new code by combining new company code with existing code after space
      const newCode = codeAfterSpace ? `${companyCode.codeName} ${codeAfterSpace}` : companyCode.codeName;
      
      if (onChange) {
        onChange("companyCodeId", companyCodeId);
        onChange("confirmSupplierItemCode", newCode);
      } else if (isCreateMode) {
        productStore.updateProductForm("companyCodeId", companyCodeId);
        // productStore.updateProductForm("confirmSupplierItemCode", newCode);
      }
    }
  };

  return (
    <div>
      <div className="relative">
        <ReactSelect options={companyCodeOptions}
                     value={selectedCompanyCode}
                     onChange={handleCompanyCodeChange}
                     placeholder={'Chọn mã công ty...'}
                     isClearable={true}
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
                     }} />
      </div>
    </div>
  )
}

export default observer(CompanyCodeGroup)
