import PageMeta from '../../../../components/common/PageMeta.tsx'
import PageBreadcrumb from '../../../../components/common/PageBreadCrumb.tsx'
import ProductDefaultInputs from '../../../../components/form/product-form/form-elements/ProductDefaultInputs.tsx'
import SupplierGroup from '../../../../components/form/product-form/supplier/Supplier.tsx'
import PatternGroup from '../../../../components/form/product-form/pattern/Pattern.tsx'
import CompanyCodeGroup from '../../../../components/form/product-form/company-code/CompanyCode.tsx'
import SizeGroup from '../../../../components/form/product-form/size/Size.tsx'

const ProductDetail = () => {
  const product = "RVTD1.12"
  return (
    <div>
      <PageMeta
        title={product}
        description={"Sản phẩm " + product}
      />
      <span>Sản phẩm <PageBreadcrumb pageTitle={product} /></span>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <ProductDefaultInputs />
        </div>
        <div className="space-y-6">
          <CompanyCodeGroup/>
          <SupplierGroup />
          <SizeGroup/>
          <PatternGroup/>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;