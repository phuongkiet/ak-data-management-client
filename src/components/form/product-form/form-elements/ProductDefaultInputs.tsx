import ComponentCard from '../../../common/ComponentCard.tsx'
import ProductLabel from '../ProductLabel.tsx'
import Input from '../input/ProductInputField.tsx'
import ProductTextArea from '../input/ProductTextArea.tsx'
import { useStore } from '../../../../app/stores/store.ts'
import CompanyCodeGroup from '../company-code/CompanyCode.tsx'
import { observer } from 'mobx-react-lite'
import ProcessingGroup from '../processing/Processing.tsx'
import StorageGroup from '../storage/Storage.tsx'
import CalculatedUnit from '../calculated-unit/CalculatedUnit.tsx'
import { ProductDetail } from '../../../../app/models/product/product.model.ts'
import { appCurrency } from '../../../../app/common/common.ts'
import { NumericFormat } from 'react-number-format'
import { useState } from 'react'

interface ProductProps {
  product?: ProductDetail
  isCreateMode: boolean;
}

const ProductDefaultInputs = ({ product, isCreateMode }: ProductProps) => {
  const { productStore, companyCodeStore } = useStore()
  const [ websiteProductPrice, setWebsiteProductPrice] = useState<number>()
  const [ confirmProductCode, setConfirmProductCode ] = useState<string | undefined>("")
  const [ supplierItemCode, setSupplierItemCode ] = useState<string>("")

  const handleConfirmProductCodeChange = () => {
      const companyCode = companyCodeStore.productCompanyCodeList.find(x => x.id == productStore.productForm.companyCodeId)
      setConfirmProductCode(companyCode?.codeName + supplierItemCode);
      console.log(companyCode + " + " + supplierItemCode)
  }

  return (
    <ComponentCard title="Thông tin mã hàng">
      {isCreateMode ? (
        <>
        <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Cột trái */}
          <ProductLabel htmlFor="input">Mã An Khánh</ProductLabel>
          <CompanyCodeGroup product={product} isCreateMode={isCreateMode}/>

          <div>
            <ProductLabel htmlFor="input">Mã SKU</ProductLabel>
            <Input
              type="text"
              id="input"
              disabled
              placeholder="Ô tự động điền"
              value={confirmProductCode}
              onChange={handleConfirmProductCodeChange}
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Mã barcode sản phẩm</ProductLabel>
            <Input
              type="text"
              id="input"
              disabled
              placeholder="Ô tự động điền"
              value={product?.confirmAutoBarCode}
              className="text-red-500"
            />
          </div>

          {/* <div>
            <ProductLabel htmlFor="input">Giá sản phẩm website</ProductLabel>
            <NumericFormat
              value={isCreateMode ? websiteProductPrice : product?.productPrice}
              thousandSeparator
              prefix={appCurrency}
              allowNegative={false}
              displayType="input"
              onValueChange={(values) => {
                const { floatValue } = values
                setWebsiteProductPrice(floatValue);
                productStore.updateProductForm('webProductPrice', floatValue ?? 0);
              }}
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Đơn vị tính</ProductLabel>
            <CalculatedUnit product={product} isCreateMode={isCreateMode}/>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <ProductLabel htmlFor="input">Khối lượng KG/Viên</ProductLabel>
              <Input
                type="number"
                id="input"
                placeholder="Ô tự động điền"
                onChange={() => {
                }}
                value={product?.weightPerUnit}
              />
            </div>
            <div>
              <ProductLabel htmlFor="input">Số lượng</ProductLabel>
              <Input
                type="number"
                id="input"
                placeholder="Ô tự động điền"
                onChange={() => {
                }}
                value={product?.quantityPerBox}
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
              value={product?.areaPerUnit}
            />
          </div> */}

          <div>
            <ProductLabel htmlFor="input">Giao hàng tại</ProductLabel>
            <StorageGroup product={product} isCreateMode={isCreateMode}/>
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
                value={supplierItemCode}
                placeholder="Mã số sản phẩm của nhà cung cấp"
                onChange={(e) => {setSupplierItemCode(e.target.value); productStore.updateProductForm('supplierItemCode', e.target.value)}}
              />
            </div>

            <div>
              <ProductLabel>Gia công khác</ProductLabel>
              <ProcessingGroup product={product} isCreateMode={isCreateMode} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <ProductLabel htmlFor="input">Số thứ tự</ProductLabel>
              <Input
                type="number"
                id="input"
                placeholder="Số thứ tự tự động"
                disabled
                value={isCreateMode ? productStore.productForm.productOrderNumber : product?.productOrderNumber || undefined}
              />
            </div>
            <div>
              <ProductLabel htmlFor="input">Mã sản phẩm</ProductLabel>
              <Input
                type="number"
                id="input"
                placeholder="Mã sản phẩm"
                disabled
                value={isCreateMode ? productStore.productForm.productCode : product?.productCode || undefined}
              />
            </div>
          </div>

          <div>
            <ProductLabel htmlFor="input">Tên hiển thị website</ProductLabel>
            <Input
              type="text"
              id="input"
              placeholder="Ô tự động điền"
              className="text-red-500"
              value={product?.displayWebsiteName || ''}
            />
          </div>

          {/* <div>
            <ProductLabel htmlFor="input">Giá khuyến mãi</ProductLabel>
            <NumericFormat
              value={product?.discountedPrice}
              thousandSeparator
              prefix={appCurrency}
              allowNegative={false}
              displayType="input"
              onValueChange={(values) => {
                const { floatValue } = values
                productStore.updateProductForm('webDiscountedPrice', floatValue ?? 0)
              }}
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
            />
          </div>
          
          <div>
            <ProductLabel htmlFor="input">Đơn vị tính tự động</ProductLabel>
            <Input
              type="text"
              id="input"
              placeholder="Ô tự động điền"
              className="text-red-500"
              value={productStore.productForm.autoCalculatedUnit || ''}
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Khối lượng KG/Thùng (Kiện)</ProductLabel>
            <Input
              type="number"
              id="input"
              placeholder="Ô tự động điền"
              value={product?.weightPerBox}
              onChange={() => {
              }}
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
              value={product?.areaPerBox}
            />
          </div> */}

          <div>
            <ProductLabel htmlFor="input">Số ngày giao hàng</ProductLabel>
            <Input
              type="text"
              id="input"
              placeholder="Số ngày giao hàng"
              value={product?.deliveryEstimatedDate || ''}
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
            value={product?.otherNote || ''}
            onChange={() => {
            }}
          />
        </div>
      </div>
      </>
      ) : (
        <>
        <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Cột trái */}
          <ProductLabel htmlFor="input">Mã An Khánh</ProductLabel>
          <CompanyCodeGroup product={product} isCreateMode={isCreateMode}/>

          <div>
            <ProductLabel htmlFor="input">Mã SKU</ProductLabel>
            <Input
              type="text"
              id="input"
              disabled
              placeholder="Ô tự động điền"
              value={product?.confirmProductCode}
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Mã barcode sản phẩm</ProductLabel>
            <Input
              type="text"
              id="input"
              disabled
              placeholder="Ô tự động điền"
              value={product?.confirmAutoBarCode}
              className="text-red-500"
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Giá sản phẩm website</ProductLabel>
            <NumericFormat
              value={isCreateMode ? websiteProductPrice : product?.productPrice}
              thousandSeparator
              prefix={appCurrency}
              allowNegative={false}
              displayType="input"
              onValueChange={(values) => {
                const { floatValue } = values
                setWebsiteProductPrice(floatValue);
                productStore.updateProductForm('webProductPrice', floatValue ?? 0);
              }}
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Đơn vị tính</ProductLabel>
            <CalculatedUnit product={product} isCreateMode={isCreateMode}/>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <ProductLabel htmlFor="input">Khối lượng KG/Viên</ProductLabel>
              <Input
                type="number"
                id="input"
                placeholder="Ô tự động điền"
                onChange={() => {
                }}
                value={product?.weightPerUnit}
              />
            </div>
            <div>
              <ProductLabel htmlFor="input">Số lượng</ProductLabel>
              <Input
                type="number"
                id="input"
                placeholder="Ô tự động điền"
                onChange={() => {
                }}
                value={product?.quantityPerBox}
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
              value={product?.areaPerUnit}
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Giao hàng tại</ProductLabel>
            <StorageGroup product={product} isCreateMode={isCreateMode}/>
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
                value={product?.supplierItemCode || ''}
                placeholder="Mã số sản phẩm của nhà cung cấp"
                onChange={(e) => productStore.updateProductForm('supplierItemCode', e.target.value)}
              />
            </div>

            <div>
              <ProductLabel>Gia công khác</ProductLabel>
              <ProcessingGroup product={product} isCreateMode={isCreateMode} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <ProductLabel htmlFor="input">Số thứ tự</ProductLabel>
              <Input
                type="number"
                id="input"
                placeholder="Số thứ tự tự động"
                disabled
                value={isCreateMode ? productStore.productForm.productOrderNumber : product?.productOrderNumber || undefined}
              />
            </div>
            <div>
              <ProductLabel htmlFor="input">Mã sản phẩm</ProductLabel>
              <Input
                type="number"
                id="input"
                placeholder="Mã sản phẩm"
                disabled
                value={isCreateMode ? productStore.productForm.productCode : product?.productCode || undefined}
              />
            </div>
          </div>

          <div>
            <ProductLabel htmlFor="input">Tên hiển thị website</ProductLabel>
            <Input
              type="text"
              id="input"
              placeholder="Ô tự động điền"
              className="text-red-500"
              value={product?.displayWebsiteName || ''}
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Giá khuyến mãi</ProductLabel>
            <NumericFormat
              value={product?.discountedPrice}
              thousandSeparator
              prefix={appCurrency}
              allowNegative={false}
              displayType="input"
              onValueChange={(values) => {
                const { floatValue } = values
                productStore.updateProductForm('webDiscountedPrice', floatValue ?? 0)
              }}
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
            />
          </div>
          
          <div>
            <ProductLabel htmlFor="input">Đơn vị tính tự động</ProductLabel>
            <Input
              type="text"
              id="input"
              placeholder="Ô tự động điền"
              className="text-red-500"
              value={productStore.productForm.autoCalculatedUnit || ''}
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Khối lượng KG/Thùng (Kiện)</ProductLabel>
            <Input
              type="number"
              id="input"
              placeholder="Ô tự động điền"
              value={product?.weightPerBox}
              onChange={() => {
              }}
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
              value={product?.areaPerBox}
            />
          </div>

          <div>
            <ProductLabel htmlFor="input">Số ngày giao hàng</ProductLabel>
            <Input
              type="text"
              id="input"
              placeholder="Số ngày giao hàng"
              value={product?.deliveryEstimatedDate || ''}
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
            value={product?.otherNote || ''}
            onChange={() => {
            }}
          />
        </div>
      </div>
        </>
      )}
      
    </ComponentCard>
  )
}

export default observer(ProductDefaultInputs)