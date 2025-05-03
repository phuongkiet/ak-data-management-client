import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from '../../../app/stores/store.ts';
import TableComponentCard from '../../../components/common/product/TableComponentCard.tsx'
import PatternTableComponent from '../../../components/tables/pattern/PatternTableComponent.tsx'

function PatternTable() {
  const { patternStore } = useStore();
  const {
    loadPatterns,
    productPatternList,
    loading
  } = patternStore;

  useEffect(() => {
    loadPatterns();
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
        description="Đây là bảng hệ vân của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Hệ vân" />
      <div className="space-y-6">
        <TableComponentCard title="Bảng hệ vân" addButtonLink={"add-pattern"} addButtonText={"Tạo hệ vân"}>
          <PatternTableComponent
            data={productPatternList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productPatternList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(PatternTable);
