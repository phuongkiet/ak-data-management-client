import { observer } from 'mobx-react-lite'
import ReactSelect from 'react-select'
import { ProductDetail } from '../../../../app/models/product/product.model.ts'
import { NoticeDataWebsite } from '../../../../app/models/product/enum/product.enum.ts'

interface Option {
  value: number;
  label: string;
}

interface ProductProps {
  product?: ProductDetail;
}

const noticeOptions: Option[] = Object.values(NoticeDataWebsite)
  .filter((v) => typeof v === 'number')
  .map((value) => ({
    value: value as number,
    label: NoticeDataWebsite[value as number].replace(/([A-Z])/g, ' $1').trim()
  }))

const NoticeDataWebsiteGroup = ({ product }: ProductProps) => {
  const selectedNotice = noticeOptions.find(
    (option) => option.value === product?.noticeDataWebsite
  )

  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={noticeOptions}
          value={selectedNotice}
          onChange={() => {
          }}
          placeholder={'Chọn ...'}
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
  )
}

export default observer(NoticeDataWebsiteGroup)