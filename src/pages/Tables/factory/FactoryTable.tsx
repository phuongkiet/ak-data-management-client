import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from '../../../app/stores/store.ts';
import TableComponentCard from '../../../components/common/product/TableComponentCard.tsx'
import FactoryTableComponent from '../../../components/tables/factory/FactoryTableComponent.tsx';

function FactoryTable() {
  const { factoryStore } = useStore();
  const {
    loadFactories,
    productFactoryList,
    loading
  } = factoryStore;

  useEffect(() => {
    loadFactories();
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
        description="Đây là bảng nhà máy của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Nhà máy" />
      <div className="space-y-6">
        <TableComponentCard title="Bảng nhà máy" addButtonLink={"add-factory"} addButtonText={"Tạo nhà máy"}>
          <FactoryTableComponent
            data={productFactoryList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productFactoryList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(FactoryTable);
