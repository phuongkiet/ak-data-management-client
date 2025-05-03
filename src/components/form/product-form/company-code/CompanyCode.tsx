import ReactSelect from 'react-select'
import { useStore } from '../../../../app/stores/store.ts'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'

interface Option {
  value: number;
  label: string;
}

const CompanyCodeGroup = () => {
  const { companyCodeStore, userStore } = useStore();
  const { loadCompanyCodes, productCompanyCodeList } = companyCodeStore;
  const { user } = userStore;


  useEffect(() => {
    loadCompanyCodes()
  }, [])

  // Mapping list
  const companyCodeOptions: Option[] = productCompanyCodeList.map(companyCode => ({
    value: companyCode.id,
    label: companyCode.codeName
  }))

  return (
    <div>
      {user?.role.includes("Admin") ? (
        <div className="relative">
          <ReactSelect options={companyCodeOptions} onChange={() => {
          }} placeholder={'Chọn mã công ty...'} styles={{
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
      ) : (
        <div className="relative">
          <ReactSelect options={companyCodeOptions} onChange={() => {
          }} placeholder={'Chọn mã công ty đi bro...'} styles={{
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
      )}
    </div>
  )
}

export default observer(CompanyCodeGroup)
