import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from '../../../app/stores/store.ts';
import TableComponentCard from '../../../components/common/product/TableComponentCard.tsx'
import OriginTableComponent from '../../../components/tables/origin/OriginTableComponent.tsx'

function OriginTable() {
  const { originStore } = useStore();
  const {
    loadOrigins,
    productOriginList,
    loading
  } = originStore;

  useEffect(() => {
    loadOrigins();
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
        description="Đây là bảng xuất xứ của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Xuất xứ" />
      <div className="space-y-6">
        <TableComponentCard title="Bảng xuất xứ" addButtonLink={"add-origin"} addButtonText={"Tạo xuất xứ"}>
          <OriginTableComponent
            data={productOriginList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productOriginList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(OriginTable);
