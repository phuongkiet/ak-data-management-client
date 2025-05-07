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
import { useStore } from '../../../../app/stores/store.ts'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'

const ProductDetail = () => {
  const { productStore } = useStore();
  const { productDetail, loadProductDetail } = productStore;
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      loadProductDetail(+id);
    }
  }, [id, loadProductDetail]);
  return (
    <div>
      <PageMeta
        title="An Khánh Data Management"
        description={"Sản phẩm " + productDetail.productCode}
      />
      <span>Sản phẩm <PageBreadcrumb pageTitle={productDetail.productCode ? productDetail.productCode : "..."} /></span>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-6">
        <div className='space-y-6'>
          <MaterialGroup product={productDetail} isCreateMode={false}/>
          <SupplierGroup product={productDetail} isCreateMode={false}/>
          <SizeGroup product={productDetail} isCreateMode={false}/>
        </div>
        <div className="space-y-6">
          <SurfaceGroup product={productDetail} isCreateMode={false}/>
          <PatternGroup product={productDetail} isCreateMode={false}/>
          <ColorGroup product={productDetail} isCreateMode={false}/>
        </div>
      </div>
      <div className='grid grid-cols-1 xl:grid-cols-12 gap-6'>
        <div className="col-span-8 space-y-6">
          <ProductDefaultInputs product={productDetail} isCreateMode={false}/>
        </div>
        <div className="col-span-8 xl:col-span-4 space-y-6">
          <ProductInputGroupRight product={productDetail} isCreateMode={false}/>
        </div>
      </div>
    </div>
  );
}

export default observer(ProductDetail);