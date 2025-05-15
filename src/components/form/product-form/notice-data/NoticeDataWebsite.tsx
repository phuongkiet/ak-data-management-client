import { observer } from 'mobx-react-lite'
import ReactSelect from 'react-select'
import { ProductDetail } from '../../../../app/models/product/product.model.ts'
import { NoticeDataWebsite } from '../../../../app/models/product/enum/product.enum.ts'
import { useStore } from '../../../../app/stores/store.ts';

interface Option {
  value: number;
  label: string;
}

interface ProductProps {
  product?: ProductDetail;
  isCreateMode: boolean;
  onChange?: (field: string, value: any) => void;
}

const noticeOptions: Option[] = Object.values(NoticeDataWebsite)
  .filter((v) => typeof v === 'number')
  .map((value) => ({
    value: value as number,
    label: NoticeDataWebsite[value as number].replace(/([A-Z])/g, ' $1').trim()
  }))

const NoticeDataWebsiteGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
  const { productStore } = useStore();
  const selectedNotice = noticeOptions.find(
    (option) => option.value === product?.noticeDataWebsite
  )

  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={noticeOptions}
          value={selectedNotice}
          defaultValue={noticeOptions[2]}
          noOptionsMessage={() => "Không có thông tin"}
          onChange={(selected) => {
            if(!selected){
              if (onChange) {
                onChange("noticeDataWebsite", null);
              } else if (isCreateMode) {
                productStore.updateProductForm("noticeDataWebsite", 0);
              }
            }

            if(isCreateMode){
              if (onChange) {
                onChange("noticeDataWebsite", selected?.value || 0);
              } else {
                productStore.updateProductForm("noticeDataWebsite", selected?.value || 0);
              }
            }
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