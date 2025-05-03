import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from '../../../app/stores/store.ts';
import TableComponentCard from '../../../components/common/product/TableComponentCard.tsx'
import BodyColorTableComponent from '../../../components/tables/body-color/BodyColorTableComponent.tsx'

function BodyColorTable() {
  const { bodyColorStore } = useStore();
  const {
    loadBodyColors,
    productBodyColorList,
    loading
  } = bodyColorStore;

  useEffect(() => {
    loadBodyColors();
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
        description="Đây là bảng màu sắc thân gạch của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Màu thân gạch" />
      <div className="space-y-6">
        <TableComponentCard title="Bảng màu thân gạch" addButtonLink={"add-body-color"} addButtonText={"Tạo màu thân gạch"}>
          <BodyColorTableComponent
            data={productBodyColorList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productBodyColorList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(BodyColorTable);
