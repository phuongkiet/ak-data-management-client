import { useStore } from '../../../../app/stores/store.ts'
import { useEffect } from 'react'
import ReactSelect from 'react-select'
import { observer } from 'mobx-react-lite'
import { ProductDetail } from '../../../../app/models/product/product.model.ts'

interface Option {
  value: number;
  label: string;
}

interface ProductProps{
  product?: ProductDetail;
  isCreateMode: boolean;
}

const StorageGroup = ({product, isCreateMode}: ProductProps) => {
  const { storageStore, productStore } = useStore()
  const { loadStorages, productStorageList } = storageStore


  useEffect(() => {
    loadStorages()
  }, [])

  // Mapping list
  const storageOptions: Option[] = productStorageList.map(storage => ({
    value: storage.id,
    label: storage.name
  }))

  const selectedStorage = storageOptions.find(
    (option) => option.value === product?.storageId
  )

  return (

    <div>
      <div className="relative">
        <ReactSelect options={storageOptions}
                     value={selectedStorage}
                     onChange={(selected) => {
                        if(!selected) {
                          productStore.productForm.storageId = 0;
                          return;
                        }

                        if(isCreateMode) {
                          const storageId = selected.value;
                          productStore.updateProductForm("storageId", storageId);
                        }
                     }}
                     placeholder={'Chọn phương thức...'}
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

export default observer(StorageGroup)
