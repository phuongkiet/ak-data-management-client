import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from '../../../app/stores/store.ts';
import TableComponentCard from '../../../components/common/product/TableComponentCard.tsx'
import CompanyCodeTableComponent from '../../../components/tables/company-code/CompanyCodeTableComponent.tsx'

function CompanyCodeTable() {
  const { companyCodeStore } = useStore();
  const {
    loadCompanyCodes,
    productCompanyCodeList,
    loading
  } = companyCodeStore;

  useEffect(() => {
    loadCompanyCodes();
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
        description="Đây là bảng mã An Khánh của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Mã An Khánh" />
      <div className="space-y-6">
        <TableComponentCard title="Bảng mã An Khánh" addButtonLink={"add-company-code"} addButtonText={"Tạo mã An Khánh"}>
          <CompanyCodeTableComponent
            data={productCompanyCodeList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productCompanyCodeList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(CompanyCodeTable);
