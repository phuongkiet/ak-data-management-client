import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import ProductTableComponent from "../../../components/tables/product/ProductTableComponent.tsx";
import { useStore } from '../../../app/stores/store.ts';
import TableComponentCard from '../../../components/common/product/TableComponentCard.tsx'
import Button from '../../../components/ui/button/Button.tsx';

function ProductTable() {
  const { productStore } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pageSize, setPageSize] = useState(productStore.pageSize || 10);

  const {
    productList,
    loadProducts,
    loading,
    pageNumber,
    setPageNumber,
    setTerm,
    totalCount,
    term,
    importProducts
  } = productStore;

  useEffect(() => {
    loadProducts(1, pageSize, term);
  }, [pageNumber, pageSize, term]);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    productStore.pageSize = newPageSize;
    setPageSize(newPageSize);
    setPageNumber(1); // Reset to first page
  };


  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await importProducts(file);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là bảng mã hàng của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Mã hàng" />
      <div className="space-y-6">
        <TableComponentCard 
          title="Bảng mã hàng" 
          addButtonText={"Tạo mã hàng"} 
          addButtonLink={"add-product"}
          additionalButtons={
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx,.xls"
                className="hidden"
              />
              <Button
                onClick={handleImportClick}
                className="ml-2 h-8 py-5 font-semibold rounded bg-sky-700 hover:bg-sky-800"
              >
                Nhập file
              </Button>
            </>
          }
          onSearch={(term) => {
            setTerm(term);
            setPageNumber(1);
          }}
        >
          <ProductTableComponent
            data={productList}
            loading={loading}
            currentPage={pageNumber}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            totalCount={totalCount}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(ProductTable);
