import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from '../../../app/stores/store.ts';
import TableComponentCard from '../../../components/common/product/TableComponentCard.tsx'
import StorageTableComponent from '../../../components/tables/storage/StorageTableComponent.tsx'

function StorageTable() {
  const { storageStore } = useStore();
  const {
    loadStorages,
    productStorageList,
    loading
  } = storageStore;

  useEffect(() => {
    loadStorages();
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
        description="Đây là bảng kho hàng của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Hình thức giao hàng" />
      <div className="space-y-6">
        <TableComponentCard title="Bảng hình thức giao hàng" addButtonLink={"add-storage"} addButtonText={"Tạo hình thức giao hàng"}>
          <StorageTableComponent
            data={productStorageList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productStorageList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(StorageTable);
