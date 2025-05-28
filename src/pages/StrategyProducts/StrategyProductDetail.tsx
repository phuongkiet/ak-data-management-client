import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import StrategyProductDefaultInputs from "../../components/form/product-form/form-elements/strategy-product/StrategyProductDefaultInputs";
import StrategyProductInputGroupRight from "../../components/form/product-form/form-elements/strategy-product/StrategyProductInputGroupRight";
import StrategyProductGeneralInfo from "../../components/form/product-form/form-elements/strategy-product/StrategyProductGeneralInfo";
const StrategyProductDetail = () => {
  const { productStore } = useStore();
  const {
    loadStrategyProductDetail,
    editStrategyProduct,
    strategyProductDetail,
  } = productStore;
  const { id } = useParams();

  // 1. Local editable state
  const [updateProduct, setUpdateProduct] = useState(
    productStore.strategyProductForm
  );

  useEffect(() => {
    if (id) {
      loadStrategyProductDetail(+id);
    }
  }, [id, loadStrategyProductDetail]);

  // 2. Sync local state when productDetail changes
  useEffect(() => {
    setUpdateProduct(productStore.strategyProductForm);
  }, [productStore.strategyProductForm]);

  // 3. Handle field change
//   const handleFieldChange = (field: string, value: any) => {
//     setUpdateProduct((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     console.log(updateProduct);
//   };

  if (!id) {
    return <div>Không tìm thấy sản phẩm</div>;
  }

  // 4. Save handler
  const handleSave = async () => {
    const updatedProduct = { ...updateProduct };
    const result = await editStrategyProduct(+id, updatedProduct);
    if (result) {
      loadStrategyProductDetail(+id);
    }
  };

  return (
    <div>
      <PageMeta
        title="An Khánh Data Management"
        description={"Sản phẩm " + strategyProductDetail.autoBarCode}
      />
      <span>
        Sản phẩm{" "}
        <PageBreadcrumb
          pageTitle={
            strategyProductDetail.autoBarCode
              ? strategyProductDetail.autoBarCode
              : "..."
          }
        />
      </span>
      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-8 mb-6">
          <StrategyProductGeneralInfo product={strategyProductDetail} />
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <StrategyProductDefaultInputs product={strategyProductDetail} />
        </div>
        <div className="col-span-8 xl:col-span-4 space-y-6">
          <StrategyProductInputGroupRight
            product={strategyProductDetail}
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

export default observer(StrategyProductDetail);
