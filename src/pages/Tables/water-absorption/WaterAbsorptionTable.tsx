import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from '../../../app/stores/store.ts';
import TableComponentCard from '../../../components/common/product/TableComponentCard.tsx'
import WaterAbsorptionTableComponent
  from '../../../components/tables/water-absorption/WaterAbsorptionTableComponent.tsx'

function WaterAbsorptionTable() {
  const { waterAbsorptionStore } = useStore();
  const {
    loadWaterAbsorption,
    productWaterAbsorptionList,
    loading
  } = waterAbsorptionStore;

  useEffect(() => {
    loadWaterAbsorption();
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
        description="Đây là bảng độ hút nước của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Độ hút nước" />
      <div className="space-y-6">
        <TableComponentCard title="Bảng độ hút nước" addButtonLink={"add-water-absorption"} addButtonText={"Tạo độ hút nước"}>
          <WaterAbsorptionTableComponent
            data={productWaterAbsorptionList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productWaterAbsorptionList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(WaterAbsorptionTable);
