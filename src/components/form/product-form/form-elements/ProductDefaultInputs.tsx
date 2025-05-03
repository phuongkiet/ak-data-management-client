import ComponentCard from '../../../common/ComponentCard.tsx'
import ProductLabel from '../ProductLabel.tsx'
import Input from '../input/ProductInputField.tsx'
import ProcessingSelect from '../processing/ProcessingSelect.tsx'
import ProductTextArea from '../input/ProductTextArea.tsx'
import { useStore } from '../../../../app/stores/store.ts'
import CompanyCodeGroup from '../company-code/CompanyCode.tsx'
import { observer } from 'mobx-react-lite'
import ProcessingGroup from '../processing/Processing.tsx'
import StorageGroup from '../storage/Storage.tsx'

const ProductDefaultInputs = () => {
  const { productStore } = useStore()
  const options = [
    { value: 1, label: 'LT' },
    { value: 2, label: 'LB' },
  ]

  return (
    <ComponentCard title="Thông tin mã hàng">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Cột trái */}
          <ProductLabel htmlFor="input">Mã An Khánh</ProductLabel>
          <CompanyCodeGroup/>

          <div>
            <ProductLabel htmlFor="input">Mã SKU</ProductLabel>
            <Input
              type="text"
              id="input"
              disabled
              placeholder="Ô tự động điền"
              value={''}
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Mã barcode sản phẩm</ProductLabel>
            <Input
              type="text"
              id="input"
              disabled
              placeholder="Ô tự động điền"
              value={''}
              className="text-red-500"
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Giá sản phẩm website</ProductLabel>
            <Input
              type="number"
              id="input"
              placeholder="Nhập giá..."
              value={productStore.productForm.webProductPrice || ''}
              onChange={(e) => productStore.updateProductForm('webProductPrice', parseFloat(e.target.value))}
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Đơn vị tính</ProductLabel>
            <ProcessingSelect
              options={options}
              value={useStore().productStore.productForm.processingId}
              onChange={() => {}}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <ProductLabel htmlFor="input">Khối lượng KG/Viên (Cái)</ProductLabel>
              <Input
                type="number"
                id="input"
                placeholder="Ô tự động điền"
                onChange={() => {}}
              />
            </div>
            <div>
              <ProductLabel htmlFor="input">Số lượng</ProductLabel>
              <Input
                type="number"
                id="input"
                placeholder="Ô tự động điền"
                onChange={() => {}}
              />
            </div>
          </div>

          <div>
            <ProductLabel htmlFor="input">Diện tích 1 viên (m2/viên)</ProductLabel>
            <Input
              type="number"
              step={0.05}
              id="input"
              disabled
              placeholder="Ô tự động điền"
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Giao hàng tại</ProductLabel>
            <StorageGroup/>
          </div>
        </div>

        {/* Cột phải */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <ProductLabel htmlFor="input">Mã số nhà cung cấp</ProductLabel>
              <Input
                type="text"
                id="input"
                value={productStore.productForm.supplierItemCode || ''}
                placeholder="Mã số sản phẩm của nhà cung cấp"
                onChange={(e) => productStore.updateProductForm('supplierItemCode', e.target.value)}
              />
            </div>

            <div>
              <ProductLabel>Gia công khác</ProductLabel>
              <ProcessingGroup/>
            </div>
          </div>

          <div>
            <ProductLabel htmlFor="input">Số thứ tự</ProductLabel>
            <Input
              type="number"
              id="input"
              placeholder="Số thứ tự tự động"
              disabled
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Tên hiển thị website</ProductLabel>
            <Input
              type="text"
              id="input"
              placeholder="Ô tự động điền"
              className="text-red-500"
              value={productStore.productForm.displayWebsiteName || ''}
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Giá khuyến mãi</ProductLabel>
            <Input
              type="number"
              id="input"
              placeholder="Nhập giá khuyến mãi..."
              value={productStore.productForm.webDiscountedPrice || ''}
              onChange={(e) => productStore.updateProductForm('webDiscountedPrice', parseFloat(e.target.value))}
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Đơn vị tính tự động</ProductLabel>
            <Input
              type="text"
              id="input"
              placeholder="Ô tự động điền"
              className="text-red-500"
              value={''}
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Khối lượng KG/Thùng (Kiện)</ProductLabel>
            <Input
              type="number"
              id="input"
              placeholder="Ô tự động điền"
              value={''}
              onChange={() => {}}
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Diện tích 1 thùng (m2/thùng)</ProductLabel>
            <Input
              type="number"
              step={0.05}
              id="input"
              disabled
              placeholder="Ô tự động điền"
              value={''}
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Số ngày giao hàng</ProductLabel>
            <Input
              type="text"
              id="input"
              placeholder="Số ngày giao hàng"
              value={productStore.productForm.deliveryEstimatedDate || ''}
              onChange={(e) => productStore.updateProductForm('deliveryEstimatedDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 mt-6">
        <div>
          <ProductLabel htmlFor="input">Ghi chú thêm</ProductLabel>
          <ProductTextArea
            placeholder="Ghi chú thêm"
            value={productStore.productForm.otherNote || ''}
            onChange={() => {
            }}
          />
        </div>
      </div>
    </ComponentCard>
  )
}

export default observer(ProductDefaultInputs)