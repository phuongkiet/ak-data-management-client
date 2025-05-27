import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from "../../../app/stores/store.ts";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import UserTableComponent from "../../../components/tables/user/UserTableComponent.tsx";

function UserTable() {
  const { userStore } = useStore();
  const {
    listAllUser,
    userList,
    loading,
  } = userStore;

  useEffect(() => {
    listAllUser();
  }, []);

  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là bảng tài khoản của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Tài khoản" />
      <div className="space-y-6">
        <TableComponentCard
          title="Bảng tài khoản"
          addButtonLink={"add-user"}
          addButtonText={"Tạo tài khoản"}
          onSearch={(term) => {
            userStore.setTerm(term);
          }}
        >
          <UserTableComponent
            data={Array.isArray(userList) ? [...userList] : []}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={userList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(UserTable);
