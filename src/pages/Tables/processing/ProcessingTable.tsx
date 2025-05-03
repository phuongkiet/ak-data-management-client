import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from '../../../app/stores/store.ts';
import TableComponentCard from '../../../components/common/product/TableComponentCard.tsx'
import ProcessingTableComponent from '../../../components/tables/processing/ProcessingTableComponent.tsx'

function ProcessingTable() {
  const { processingStore } = useStore();
  const {
    loadProcessings,
    productProcessingList,
    loading
  } = processingStore;

  useEffect(() => {
    loadProcessings();
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
        description="Đây là bảng gia công khác của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Gia công khác" />
      <div className="space-y-6">
        <TableComponentCard title="Bảng gia công khác" addButtonLink={"add-processing"} addButtonText={"Tạo gia công khác"}>
          <ProcessingTableComponent
            data={productProcessingList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productProcessingList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(ProcessingTable);
