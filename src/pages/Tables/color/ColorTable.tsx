import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from '../../../app/stores/store.ts';
import TableComponentCard from '../../../components/common/product/TableComponentCard.tsx'
import ColorTableComponent from '../../../components/tables/color/ColorTableComponent.tsx'

function ColorTable() {
  const { colorStore } = useStore();
  const {
    loadColors,
    productColorList,
    loading
  } = colorStore;

  useEffect(() => {
    loadColors();
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
        description="Đây là bảng màu sắc của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Màu sắc" />
      <div className="space-y-6">
        <TableComponentCard title="Bảng màu sắc" addButtonLink={"add-color"} addButtonText={"Tạo màu sắc"}>
          <ColorTableComponent
            data={productColorList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productColorList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(ColorTable);
