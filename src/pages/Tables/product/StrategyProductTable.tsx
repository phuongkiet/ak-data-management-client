import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import StrategyProductTableComponent from "../../../components/tables/product/StrategyProductTableComponent.tsx";
import { useStore } from "../../../app/stores/store.ts";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";

const StrategyProductTable = () => {
  const { productStore } = useStore();
  const [pageSize, setPageSize] = useState(productStore.pageSize || 10);
  const {
    strategyProductList,
    loadStrategyProducts,
    loading,
    pageNumber,
    setPageNumber,
    setTerm,
    totalCount,
    term,
  } = productStore;

  useEffect(() => {
    loadStrategyProducts(pageSize, pageNumber, term);
  }, [pageSize, pageNumber, term]);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    productStore.pageSize = newPageSize;
    setPageSize(newPageSize);
    setPageNumber(1); // Reset to first page
  };

  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là bảng tính giá sản phẩm của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Bảng tính giá" />
      <div className="space-y-6">
        <TableComponentCard
          title="Bảng tính giá"
          onSearch={(term) => {
            setTerm(term);
            setPageNumber(1);
          }}
        >
          <StrategyProductTableComponent
            data={strategyProductList}
            loading={loading}
            currentPage={pageNumber}
            onPageChange={handlePageChange}
            totalCount={totalCount}
            searchTerm={term}
            onPageSizeChange={handlePageSizeChange}
          />
        </TableComponentCard>
      </div>
    </>
  );
};

export default observer(StrategyProductTable);
