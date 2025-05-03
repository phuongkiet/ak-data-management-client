import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from '../../../app/stores/store.ts';
import TableComponentCard from '../../../components/common/product/TableComponentCard.tsx'
import MaterialTableComponent from '../../../components/tables/material/MaterialTableComponent.tsx'

function MaterialTable() {
  const { materialStore } = useStore();
  const {
    loadMaterials,
    productMaterialList,
    loading
  } = materialStore;

  useEffect(() => {
    loadMaterials();
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
        description="Đây là bảng chất liệu của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Chất liệu" />
      <div className="space-y-6">
        <TableComponentCard title="Bảng chất liệu" addButtonLink={"add-material"} addButtonText={"Tạo chất liệu"}>
          <MaterialTableComponent
            data={productMaterialList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productMaterialList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(MaterialTable);
