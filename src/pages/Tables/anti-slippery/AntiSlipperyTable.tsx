import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from '../../../app/stores/store.ts';
import TableComponentCard from '../../../components/common/product/TableComponentCard.tsx'
import AntiSlipperyTableComponent from '../../../components/tables/anti-slippery/AntiSlipperyTableComponent.tsx'

function AntiSlipperyTable() {
  const { antiSlipperyStore } = useStore();
  const {
    loadAntiSlipperys,
    productAntiSlipperyList,
    loading
  } = antiSlipperyStore;

  useEffect(() => {
    loadAntiSlipperys();
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
        description="Đây là bảng mức độ chống trượt của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Mức độ chống trượt" />
      <div className="space-y-6">
        <TableComponentCard title="Bảng mức độ chống trượt" addButtonLink={"add-anti-slippery"} addButtonText={"Tạo mức độ chống trượt"}>
          <AntiSlipperyTableComponent
            data={productAntiSlipperyList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productAntiSlipperyList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(AntiSlipperyTable);
