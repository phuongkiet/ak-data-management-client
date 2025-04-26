import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import ProductTableComponent from "../../../components/tables/BasicTables/ProductTableComponent.tsx";
import { useStore } from '../../../app/stores/store.ts';
import Button from '../../../components/ui/button/Button.tsx'

function ProductTable() {
  const { productStore } = useStore();
  const {
    productList,
    loadProducts,
    loading,
    totalPages,
    pageNumber,
    setPageNumber,
    setTerm,
    totalCount,
    term
  } = productStore;

  useEffect(() => {
    loadProducts();
  }, []);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handleSearch = (searchTerm: string) => {
    setTerm(searchTerm);
  };

  return (
    <>
      <PageMeta
        title="Mã hàng | An Khánh House"
        description="Đây là bảng mã hàng của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Mã hàng" />
      <Button type='button' onClick={() => {}} size='sm' className='mb-3 text-white'>Tạo mã hàng</Button>
      <div className="space-y-6">
        <ComponentCard title="Bảng mã hàng">
          <ProductTableComponent
            data={productList}
            loading={loading}
            totalPages={totalPages}
            currentPage={pageNumber}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            totalCount={totalCount}
            searchTerm={term}
          />
        </ComponentCard>
      </div>
    </>
  );
}

export default observer(ProductTable);
