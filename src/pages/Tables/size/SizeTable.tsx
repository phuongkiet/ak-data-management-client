import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from '../../../app/stores/store.ts';
import TableComponentCard from '../../../components/common/product/TableComponentCard.tsx'
import SizeTableComponent from '../../../components/tables/size/SizeTableComponent.tsx'

function SizeTable() {
  const { sizeStore } = useStore();
  const {
    loadSizes,
    productSizeList,
    loading
  } = sizeStore;

  useEffect(() => {
    loadSizes();
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
        description="Đây là bảng kích thước của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Kích thước" />
      <div className="space-y-6">
        <TableComponentCard title="Bảng kích thước" addButtonLink={"add-size"} addButtonText={"Tạo kích thước"}>
          <SizeTableComponent
            data={productSizeList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productSizeList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(SizeTable);
