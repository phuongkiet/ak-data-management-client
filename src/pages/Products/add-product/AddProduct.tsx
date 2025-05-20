import PageMeta from '../../../components/common/PageMeta.tsx'
import PageBreadcrumb from '../../../components/common/PageBreadCrumb.tsx'
import ProductDefaultInputs from '../../../components/form/product-form/form-elements/product/ProductDefaultInputs.tsx'
import SupplierGroup from '../../../components/form/product-form/supplier/Supplier.tsx'
import PatternGroup from '../../../components/form/product-form/pattern/Pattern.tsx'
import SizeGroup from '../../../components/form/product-form/size/Size.tsx'
import SurfaceGroup from '../../../components/form/product-form/surface/Surface.tsx'
import MaterialGroup from '../../../components/form/product-form/material/Material.tsx'
import ColorGroup from '../../../components/form/product-form/color/Color.tsx'
import ProductInputGroupRight from '../../../components/form/product-form/form-elements/product/ProductInputGroupRight.tsx'
import { useStore } from '../../../app/stores/store.ts'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const AddProduct = () => {
  const { productStore } = useStore();
  const navigate = useNavigate();
  const [thicknessError, setThicknessError] = useState<string>('');

  const handleSubmit = async () => {
    const result = await productStore.createProduct();
    if (result) {
      navigate('/products');
    }
  };
  
  return (
    <div>
      <PageMeta
        title="An Khánh Data Management"
        description={"Add product page"}
      />
      <PageBreadcrumb pageTitle={"Thêm sản phẩm"} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-6">
        <div className='space-y-6'>
          <MaterialGroup isCreateMode={true}/>
          <SupplierGroup isCreateMode={true}/>
          <SizeGroup isCreateMode={true} thicknessError={thicknessError} setThicknessError={setThicknessError} />
        </div>
        <div className="space-y-6">
          <SurfaceGroup isCreateMode={true}/>
          <PatternGroup isCreateMode={true}/>
          <ColorGroup isCreateMode={true}/>
        </div>
      </div>
      <div className='grid grid-cols-12 gap-6'>
        <div className="col-span-8 space-y-6">
          <ProductDefaultInputs isCreateMode={true}/>
        </div>
        <div className="col-span-4 space-y-6">
          <ProductInputGroupRight isCreateMode={true}/>
        </div>
      </div>
      <div className="mt-6 flex justify-start">
        <button
          onClick={handleSubmit}
          disabled={!!thicknessError || productStore.loading}
          className={`inline-flex items-center justify-center rounded-lg bg-[#334355] px-6 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#283849] focus:outline-none focus:ring-2 focus:bg-[#283849]/50 disabled:opacity-50 disabled:cursor-not-allowed ${!!thicknessError ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {productStore.loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            'Tạo sản phẩm'
          )}
        </button>
      </div>
    </div>
  );
}

export default observer(AddProduct);