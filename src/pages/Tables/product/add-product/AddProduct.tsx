import PageMeta from '../../../../components/common/PageMeta.tsx'
import PageBreadcrumb from '../../../../components/common/PageBreadCrumb.tsx'
import ProductDefaultInputs from '../../../../components/form/product-form/form-elements/ProductDefaultInputs.tsx'
import SupplierGroup from '../../../../components/form/product-form/supplier/Supplier.tsx'
import PatternGroup from '../../../../components/form/product-form/pattern/Pattern.tsx'
import SizeGroup from '../../../../components/form/product-form/size/Size.tsx'
import SurfaceGroup from '../../../../components/form/product-form/surface/Surface.tsx'
import MaterialGroup from '../../../../components/form/product-form/material/Material.tsx'
import ColorGroup from '../../../../components/form/product-form/color/Color.tsx'
import ProductInputGroupRight from '../../../../components/form/product-form/form-elements/ProductInputGroupRight.tsx'

const AddProduct = () => {
  return (
    <div>
      <PageMeta
        title="An Khánh Data Management"
        description={"Add product page"}
      />
      <PageBreadcrumb pageTitle={"Thêm sản phẩm"} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-6">
        <div className='space-y-6'>
          <MaterialGroup/>
          <SupplierGroup />
          <SizeGroup />
        </div>
        <div className="space-y-6">
          <SurfaceGroup/>
          <PatternGroup />
          <ColorGroup/>
        </div>
      </div>
      <div className='grid grid-cols-12 gap-6'>
        <div className="col-span-8 space-y-6">
          <ProductDefaultInputs />
        </div>
        <div className="col-span-4 space-y-6">
          <ProductInputGroupRight />
        </div>
      </div>
    </div>
  );
}

export default AddProduct;