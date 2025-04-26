import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import StrategyProductTableComponent from "../../../components/tables/BasicTables/StrategyProductTableComponent.tsx";
import { useStore } from '../../../app/stores/store.ts'
import { useEffect } from 'react'

export default function ProductTable() {
  const { productStore } = useStore();
  const {
    strategyProductList,
    loadStrategyProducts,
    loading,
    totalPages,
    pageNumber,
    setPageNumber,
    setTerm,
    totalCount,
    term
  } = productStore;

  useEffect(() => {
    loadStrategyProducts();
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
        title="Bảng tính giá | An Khánh House"
        description="Đây là bảng tính giá sản phẩm của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Bảng tính giá" />
      <div className="space-y-6">
        <ComponentCard title="Bảng tính giá">
          <StrategyProductTableComponent
            data={strategyProductList}
            loading={loading}
            totalPages={totalPages}
            currentPage={pageNumber}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            totalCount={totalCount}
            searchTerm={term}/>
        </ComponentCard>
      </div>
    </>
  );
}
