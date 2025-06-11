import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from "../../../app/stores/store.ts";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import UserTableComponent from "../../../components/tables/user/UserTableComponent.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import ProductLabel from "../../../components/form/product-form/ProductLabel.tsx";
import ProductInputField from "../../../components/form/product-form/input/product/ProductInputField.tsx";
import { useApi } from "../../../hooks/useApi.ts";
import { toast } from "react-toastify";
import { AddUserDto } from "../../../app/models/user/user.model.ts";
import ReactSelect from "react-select";


function UserTable() {
  const { userStore, roleStore } = useStore();
  const {
    listAllUser,
    userList,
    loading,
  } = userStore;
  const { isOnline } = useApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<AddUserDto>({
    birthday: null,
    fullName: "",
    userName: "",
    phoneNumber: "",
    email: "",
    roleId: 0
  });

  function changeRoleName(roleName: string) {
    switch (roleName) {
      case "Admin":
        return "Quản trị viên";
      case "Strategist":
        return "Chiến lược giá";
      case "Client":
        return "Nhân viên";
      default:
        return roleName;
    }
  }

  const roleOptions = roleStore.roleList.map((role) => ({
    value: role.id,
    label: changeRoleName(role.name),
  }));

  const selectedRole = roleOptions.find(option => option.value === formData.roleId) || null;

  useEffect(() => {
    if (isOnline) {
      listAllUser();
    }
  }, [isOnline]);

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
          useModal={true}
          isModalOpen={isModalOpen}
          modalClose={() => setIsModalOpen(false)}
          onModalOpen={() => setIsModalOpen(true)}
          modalStyle="w-full max-w-4xl rounded-3xl space-y-4 p-6"
          className="text-white"
          modalContent={
            <div>
              <h1 className="text-2xl font-bold mb-2">Tạo tài khoản người dùng</h1>
              <div className="space-y-4">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const success = await userStore.addUser(formData);
                      if (success) {
                        setIsModalOpen(false);
                        setFormData({
                          birthday: null,
                          fullName: "",
                          userName: "",
                          phoneNumber: "",
                          email: "",
                          roleId: 0
                        });

                      }
                    } catch (error) {
                      setIsModalOpen(false);
                      console.error("Error updating user:", error);
                      toast.error("Có lỗi xảy ra khi cập nhật thông tin người dùng");
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <ProductLabel htmlFor="userName" tooltipId="unique-tooltip-id"
                        tooltip="Đây là username, không được trùng với username của người dùng khác">Tên tài khoản</ProductLabel>
                      <ProductInputField
                        type="text"
                        id="userName"
                        name="userName"
                        placeholder="Nhập tên tài khoản"
                        value={formData.userName}
                        onChange={(e) =>
                          setFormData((data) => ({
                            ...data,
                            userName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <ProductLabel htmlFor="phoneNumber">Số điện thoại</ProductLabel>
                      <ProductInputField
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Nhập số điện thoại"
                        value={formData.phoneNumber ?? ""}
                        onChange={(e) =>
                          setFormData((data) => ({
                            ...data,
                            phoneNumber: e.target.value || "",
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <ProductLabel htmlFor="email">Email</ProductLabel>
                      <ProductInputField
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Nhập email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((data) => ({
                            ...data,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <ProductLabel htmlFor="birthday" tooltipId="unique-tooltip-id"
                        tooltip="Đây là ngày sinh, nhập theo cú pháp tháng/ngày/năm">Ngày sinh</ProductLabel>
                      <ProductInputField
                        type="date"
                        id="birthday"
                        name="birthday"
                        value={formData.birthday ?? ""}
                        onChange={(e) =>
                          setFormData((data) => ({
                            ...data,
                            birthday: e.target.value || null,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <ProductLabel htmlFor="fullName" tooltipId="unique-tooltip-id"
                        tooltip="Đây là họ tên, yêu cầu nhập đầy đủ họ và tên">Họ tên</ProductLabel>
                      <ProductInputField
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="Nhập họ tên"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData((data) => ({
                            ...data,
                            fullName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <ProductLabel htmlFor="roleId">Vai trò</ProductLabel>
                      <ReactSelect
                        options={roleOptions}
                        value={selectedRole}
                        onChange={(selectedOption) =>
                          setFormData((data) => ({
                            ...data,
                            roleId: selectedOption?.value ?? 0,
                          }))
                        }
                        placeholder="Chọn vai trò"
                        noOptionsMessage={() => "Không có kết quả"}
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: "44px",
                            height: "44px",
                            fontFamily: "Roboto, sans-serif",
                            fontSize: "14px",
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            height: "44px",
                            padding: "0 8px",
                          }),
                          indicatorsContainer: (base) => ({
                            ...base,
                            height: "44px",
                          }),
                          option: (base, state) => ({
                            ...base,
                            fontFamily: "Roboto, sans-serif",
                            backgroundColor: state.isFocused
                              ? "#f3f4f6"
                              : "white",
                            color: "black",
                          }),
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-center text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Đang xử lý...
                        </>
                      ) : (
                        "Tạo tài khoản"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          }
          onSearch={(term) => {
            userStore.setTerm(term);
          }}
          isOnline={isOnline}
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
