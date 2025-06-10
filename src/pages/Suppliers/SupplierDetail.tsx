import { useProductMetadata } from "../../app/context/ProductMetadataContext";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SupplierDefaultInput from "../../components/form/product-form/form-elements/supplier/SupplierDefaultInput";
import { useEffect } from "react";


const SupplierDetail = () => {
  const { supplierStore } = useStore();
  const { loading: metadataLoading } = useProductMetadata();
  const { loadSupplierDetail } = supplierStore;
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadSupplierDetail(Number(id));
    }
  }, [id]);

  const handleSubmit = async () => {
    const result = await supplierStore.updateSupplier(Number(id));
    if (result) {
      navigate('/suppliers');
    }
  };
  
  if (metadataLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <PageMeta
        title="An Khánh Data Management"
        description={"Detail supplier page"}
      />
      <PageBreadcrumb pageTitle={"Thông tin nhà cung cấp"} />
      <div className='grid grid-cols-1 gap-6'>
        <div className="space-y-6">
          <SupplierDefaultInput/>
        </div>
      </div>
      <div className="mt-6 flex justify-start">
        <button
          onClick={handleSubmit}
          disabled={supplierStore.loading}
          className={`inline-flex items-center justify-center rounded-lg bg-[#334355] px-6 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#283849] focus:outline-none focus:ring-2 focus:bg-[#283849]/50 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {supplierStore.loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            'Lưu nhà cung cấp'
          )}
        </button>
      </div>
    </div>
  );
}

export default observer(SupplierDetail);