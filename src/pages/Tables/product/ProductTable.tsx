import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import ProductTableComponent from "../../../components/tables/product/ProductTableComponent.tsx";
import { useStore } from '../../../app/stores/store.ts';
import TableComponentCard from '../../../components/common/product/TableComponentCard.tsx'

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
        title="An Khánh Data Management"
        description="Đây là bảng mã hàng của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Mã hàng" />
      <div className="space-y-6">
        <TableComponentCard title="Bảng mã hàng" addButtonText={"Tạo mã hàng"} addButtonLink={"add-product"}>
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
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(ProductTable);
