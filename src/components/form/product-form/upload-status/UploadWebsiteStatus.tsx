import { observer } from 'mobx-react-lite'
import ReactSelect from 'react-select'
import { ProductDetail } from '../../../../app/models/product/product.model.ts'
import { UploadWebsiteStatus } from '../../../../app/models/product/enum/product.enum.ts'
import { useStore } from '../../../../app/stores/store.ts';
import { uploadWebsiteStatusToVietnamese } from '../../../../app/common/common';
interface Option {
  value: number;
  label: string;
}

interface ProductProps {
  product?: ProductDetail;
  isCreateMode: boolean;
  onChange?: (field: string, value: any) => void;
}

const statusOptions: Option[] = Object.values(UploadWebsiteStatus)
  .filter((v) => typeof v === 'number')
  .map((value) => ({
    value: value as number,
    label: uploadWebsiteStatusToVietnamese(UploadWebsiteStatus[value as number])
  }))


const UploadWebSiteStatusGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
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
          defaultValue={statusOptions[5]}
          onChange={(selected) => {
            if(!selected){
              if (onChange) {
                onChange("uploadWebsiteStatus", 6);
              } else if (isCreateMode) {
                productStore.updateProductForm("uploadWebsiteStatus", 6);
              }
            }

            if(isCreateMode){
              if (onChange) {
                onChange("uploadWebsiteStatus", selected?.value || 0);
              } else if (isCreateMode) {
                productStore.updateProductForm("uploadWebsiteStatus", selected?.value || 0);
              }
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