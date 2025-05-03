import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from '../../../app/stores/store.ts';
import TableComponentCard from '../../../components/common/product/TableComponentCard.tsx'
import SurfaceTableComponent from '../../../components/tables/surface/SurfaceTableComponent.tsx'

function SurfaceTable() {
  const { surfaceStore } = useStore();
  const {
    loadSurfaces,
    productSurfaceList,
    loading
  } = surfaceStore;

  useEffect(() => {
    loadSurfaces();
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
        description="Đây là bảng bề mặt của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Bề maặt" />
      <div className="space-y-6">
        <TableComponentCard title="Bảng bề mặt" addButtonLink={"add-surface"} addButtonText={"Tạo bề mặt"}>
          <SurfaceTableComponent
            data={productSurfaceList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productSurfaceList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(SurfaceTable);
