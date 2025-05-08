import { observer } from 'mobx-react-lite'
import ReactSelect from 'react-select'
import { ProductDetail } from '../../../../app/models/product/product.model.ts'
import { UploadWebsiteStatus } from '../../../../app/models/product/enum/product.enum.ts'
import { useStore } from '../../../../app/stores/store.ts';
interface Option {
  value: number;
  label: string;
}

interface ProductProps {
  product?: ProductDetail;
  isCreateMode: boolean;
}

const statusOptions: Option[] = Object.values(UploadWebsiteStatus)
  .filter((v) => typeof v === 'number')
  .map((value) => ({
    value: value as number,
    label: UploadWebsiteStatus[value as number].replace(/([A-Z])/g, ' $1').trim()
  }))


const UploadWebSiteStatusGroup = ({ product, isCreateMode }: ProductProps) => {
  const { productStore } = useStore();
  const selectedStatus = statusOptions.find(
    (option) => option.value === product?.uploadWebsiteStatus
  )

  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={statusOptions}
          value={selectedStatus}
          onChange={(selected) => {
            if(!selected){
              productStore.updateProductForm("uploadWebsiteStatus", 6)
            }

            if(isCreateMode){
              productStore.updateProductForm("uploadWebsiteStatus", selected?.value || 0)
            }
          }}
          placeholder={'Chọn trạng thái...'}
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

export default observer(UploadWebSiteStatusGroup)