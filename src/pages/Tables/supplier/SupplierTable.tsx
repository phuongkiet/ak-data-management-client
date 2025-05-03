import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from '../../../app/stores/store.ts';
import TableComponentCard from '../../../components/common/product/TableComponentCard.tsx'
import SupplierTableComponent from '../../../components/tables/supplier/SupplierTableComponent.tsx'

function SupplierTable() {
  const { supplierStore } = useStore();
  const {
    loadSuppliers,
    productSupplierList,
    loading
  } = supplierStore;

  useEffect(() => {
    loadSuppliers();
  }, []);

  // const handlePageChange = (page: number) => {
  //   setPageNumber(page);
  // };
  //
  // const handleSearch = (searchTerm: string) => {
  //   setTerm(searchTerm);
  // };

  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là bảng nhà cung cấp của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Nhà cung cấp" />
      <div className="space-y-6">
        <TableComponentCard title="Bảng nhà cung cấp" addButtonLink={"add-supplier"} addButtonText={"Tạo nhà cung cấp"}>
          <SupplierTableComponent
            data={productSupplierList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productSupplierList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(SupplierTable);
