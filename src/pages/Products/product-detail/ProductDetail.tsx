import PageMeta from "../../../components/common/PageMeta.tsx";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ProductDefaultInputs from "../../../components/form/product-form/form-elements/product/ProductDefaultInputs.tsx";
import SupplierGroup from "../../../components/form/product-form/supplier/Supplier.tsx";
import PatternGroup from "../../../components/form/product-form/pattern/Pattern.tsx";
import SizeGroup from "../../../components/form/product-form/size/Size.tsx";
import SurfaceGroup from "../../../components/form/product-form/surface/Surface.tsx";
import MaterialGroup from "../../../components/form/product-form/material/Material.tsx";
import ColorGroup from "../../../components/form/product-form/color/Color.tsx";
import ProductInputGroupRight from "../../../components/form/product-form/form-elements/product/ProductInputGroupRight.tsx";
import { useStore } from "../../../app/stores/store.ts";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

// Hàm sinh displayWebsiteName
function generateDisplayWebsiteName(
  autoBarCode: string,
  product: any,
  patternStore: any,
  sizeStore: any,
  colorStore: any,
  bodyColorStore: any,
  materialStore: any,
  surfaceStore: any
) {
  const pattern = patternStore.productPatternList.find((x: any) => x.id === product.brickPatternId);
  const size = sizeStore.productSizeList.find((x: any) => x.id === product.actualSizeId);
  const color = colorStore.productColorList.find((x: any) => x.id === product.colorId);
  const bodyColor = bodyColorStore.productBodyColorList.find((x: any) => x.id === product.brickBodyId);
  const material = materialStore.productMaterialList.find((x: any) => x.id === product.materialId);
  const surfaceFeature = surfaceStore.productSurfaceList.find((x: any) => x.id === product.surfaceFeatureId);

  const actualSize = size
    ? `${Number(size.wide) / 10} x ${Number(size.length) / 10} cm`
    : "";

  if (pattern?.name) {
    return `${autoBarCode} - ${actualSize} - ${pattern.name} ${color?.name} ${surfaceFeature?.name} ${material?.name} ${bodyColor?.name}`.trim();
  }
  return "";
}

const ProductDetail = () => {
  const { productStore, patternStore, supplierStore, sizeStore, colorStore, bodyColorStore, materialStore, surfaceStore } = useStore();
  const { productDetail, loadProductDetail, editProduct } = productStore;
  const { id } = useParams();

  // 1. Local editable state
  const [updateProduct, setUpdateProduct] = useState(productDetail);

  useEffect(() => {
    if (id) {
      loadProductDetail(+id);
    }
  }, [id]);

  // 2. Sync local state when productDetail changes
  useEffect(() => {
    setUpdateProduct(productDetail);
  }, [productDetail]);

  // 3. Handle field change
  const handleFieldChange = (field: string, value: any) => {
    setUpdateProduct((prev) => {
      const updated = { ...prev, [field]: value };

      // Nếu đổi pattern, cập nhật autoBarCode
      if (field === "brickPatternId") {
        const pattern = patternStore.productPatternList.find((x: any) => x.id === value);
        updated.brickPatternShortName = pattern?.shortCode || "";
        // Sinh lại autoBarCode với orderNumber hiện tại (không tăng)
        const supplier = supplierStore.productSupplierList.find((x: any) => x.id === updated.supplierId);
        const patternCode = pattern?.shortCode || "";
        const currentOrderNumber = updated.productOrderNumber || "";
        updated.autoBarCode = supplier?.supplierShortCode
          ? `${supplier.supplierShortCode}.${currentOrderNumber}${patternCode}`
          : "";
      }

      // Nếu đổi các trường ảnh hưởng đến displayWebsiteName
      const affectDisplayFields = [
        "brickPatternId",
        "actualSizeId",
        "colorId",
        "brickBodyId",
        "materialId",
        "surfaceFeatureId"
      ];
      if (affectDisplayFields.includes(field)) {
        updated.displayWebsiteName = generateDisplayWebsiteName(
          updated.autoBarCode,
          updated,
          patternStore,
          sizeStore,
          colorStore,
          bodyColorStore,
          materialStore,
          surfaceStore
        );
      }

      return updated;
    });
  };

  if (!id) {
    return <div>Không tìm thấy sản phẩm</div>;
  }

  // 4. Save handler
  const handleSave = async () => {
    const updatedProduct = { ...updateProduct };
    
    // if(updatedProduct.processingId === 0) {
    //     updatedProduct.processingId = null;
    // }
    if(updatedProduct.productFactoryId === 0) {
        updatedProduct.productFactoryId = null;
    }
    if(updatedProduct.taxId === 0) {
        updatedProduct.taxId = 3;
    }
    
    const result = await editProduct(+id, updatedProduct);
    if(result) {
      loadProductDetail(+id);
    }
  };

  return (
    <div>
      <PageMeta
        title="An Khánh Data Management"
        description={"Sản phẩm " + updateProduct.autoBarCode}
      />
      <span>
        Sản phẩm{" "}
        <PageBreadcrumb
          pageTitle={
            updateProduct.autoBarCode ? updateProduct.autoBarCode : "..."
          }
          isUploaded={updateProduct.uploadWebsiteStatus === 1}
        />
      </span>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-6">
        <div className="space-y-6">
          <MaterialGroup
            product={updateProduct}
            isCreateMode={false}
            onChange={handleFieldChange}
          />
          <SupplierGroup
            product={updateProduct}
            isCreateMode={false}
            onChange={handleFieldChange}
          />
          <SizeGroup
            product={updateProduct}
            isCreateMode={false}
            setThicknessError={() => {}}
            thicknessError=""
            onChange={handleFieldChange}
          />
        </div>
        <div className="space-y-6">
          <SurfaceGroup
            product={updateProduct}
            isCreateMode={false}
            onChange={handleFieldChange}
          />
          <PatternGroup
            product={updateProduct}
            isCreateMode={false}
            onChange={handleFieldChange}
          />
          <ColorGroup
            product={updateProduct}
            isCreateMode={false}
            onChange={handleFieldChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <ProductDefaultInputs
            product={updateProduct}
            isCreateMode={false}
            onChange={handleFieldChange}
          />
        </div>
        <div className="col-span-8 xl:col-span-4 space-y-6">
          <ProductInputGroupRight
            product={updateProduct}
            isCreateMode={false}
            onChange={handleFieldChange}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-start">
        <button
          onClick={handleSave}
          disabled={productStore.loading}
          className={`inline-flex items-center justify-center rounded-lg bg-[#334355] font-semibold px-6 py-2.5 text-center text-sm text-white hover:bg-[#283849] focus:outline-none focus:ring-2 focus:bg-[#283849]/50 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {productStore.loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            "Lưu thay đổi"
          )}
        </button>
      </div>
    </div>
  );
};

export default observer(ProductDetail);
