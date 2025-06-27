import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useStore } from "../../../app/stores/store.ts";
import { UserDto } from "../../../app/models/user/user.model.ts";
import { RoleDto } from "../../../app/models/role/role.model.ts";
import Badge from "../../ui/badge/Badge.tsx";
import { observer } from "mobx-react-lite";
import Modal from "../../ui/modal/index.tsx";
import Button from "../../ui/button/Button.tsx";
import ProductLabel from "../../form/product-form/ProductLabel.tsx";
import ProductInputField from "../../form/product-form/input/product/ProductInputField.tsx";
import ReactSelect from "react-select";
import ProductDatePicker from "../../form/product-form/product-date-picker.tsx";
import { formatDateLocal } from "../../../app/common/common.ts";
import { useTheme } from "../../../app/context/ThemeContext.tsx";
import { CiEdit } from "react-icons/ci";
import { Tooltip } from 'react-tooltip';
import { CiLock, CiUnlock  } from "react-icons/ci";

interface UserTableComponentProps {
  data: UserDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  searchTerm: string;
}

const UserTableComponent = ({ data }: UserTableComponentProps) => {
  const { userStore, roleStore } = useStore();
  const { loading } = userStore;
  const [isOpenModalUpdateUser, setIsOpenModalUpdateUser] = useState(false);
  const [editUser, setEditUser] = useState<UserDto | null>(null);
  const { theme } = useTheme();
  const handleBanUser = (user: UserDto) => {
    userStore.banUser(user.email);
  };

  const handleUnBanUser = (user: UserDto) => {
    userStore.unBanUser(user.email);
  };

  const handleOpenModalUpdateUser = (user: UserDto) => {
    setEditUser({ ...user });
    setIsOpenModalUpdateUser(true);
  };

  const handleUpdateUser = async (user: UserDto) => {
    console.log(user);  
    const result = await userStore.updateUser(user.email, {
      birthday: user.birthday,
      name: user.name,
      userName: user.userName,
      phoneNumber: user.phoneNumber,
      roleId: user.roleId,
    });
    if (result) {
      setIsOpenModalUpdateUser(false);
    }else{
      setIsOpenModalUpdateUser(false);
    }
  };

  const roleOptions = roleStore.roleList.map((role: RoleDto) => ({
    label: role.name,
    value: role.id,
  }));

  const columns: TableColumn<UserDto>[] = [
    {
      name: "STT",
      selector: (row) => row.id,
      sortable: true,
      maxWidth: "5px",
    },
    {
      name: "Tên",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Số điện thoại",
      selector: (row) => row.phoneNumber,
      sortable: true,
    },
    {
      name: "Vai trò",
      selector: (row) => {
        const roleMap: Record<string, string> = {
          Admin: "Quản trị viên",
          Strategist: "Chiến lược gia",
          Client: "Người dùng",
        };
        return roleMap[row.role] || row.role;
      },
      sortable: true,
    },
    {
      name: "Trạng thái",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => {
        const isActive = row.status === 1 ? "Đang hoạt động" : "Đã khóa";
        return (
          <Badge size="sm" color={row.status === 1 ? "success" : "error"}>
            {isActive}
          </Badge>
        );
      },
    },
    {
      name: "Hành động",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              row.status === 1 ? handleBanUser(row) : handleUnBanUser(row)
            }
            className="text-blue-600 font-medium"
            data-tooltip-id="lock-tooltip"
            data-tooltip-content={row.status === 1 ? "Khóa" : "Mở khóa"}
          >
            {row.status === 1 ? <CiLock className="w-6 h-6 hover:opacity-50" /> : <CiUnlock className="w-6 h-6 hover:opacity-50 " />}
            <Tooltip id="lock-tooltip" className="text-md" />

          </button>
          <button
            onClick={() => handleOpenModalUpdateUser(row)}
            className="text-blue-600 font-medium"
            data-tooltip-id="view-tooltip"
            data-tooltip-content="Xem"
          >
            <CiEdit className="w-6 h-6 hover:opacity-50" />
            <Tooltip id="view-tooltip" className="text-md" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
      <DataTable
        theme={theme === 'dark' ? 'customDark' : 'default'}
        columns={columns}
        data={data}
        pagination
        responsive
        highlightOnHover
        striped
        selectableRows
        progressPending={loading}
        progressComponent={
          <div className="py-8 text-center font-semibold font-roboto w-full">
            Đang chờ...
          </div>
        }
        noDataComponent={
          <div className="py-8 text-center font-semibold font-roboto w-full">
            Không có dữ liệu để hiển thị.
          </div>
        }
      />
      <Modal
        isOpen={isOpenModalUpdateUser}
        onClose={() => setIsOpenModalUpdateUser(false)}
        className="max-w-2xl"
      >
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
            Cập nhật người dùng
          </h2>
          {editUser && (
            <>
              <div>
                <ProductLabel
                  className="block text-sm font-medium mb-1"
                  htmlFor="name"
                >
                  Tên
                </ProductLabel>
                <ProductInputField
                  type="text"
                  id="name"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                />
              </div>
              <div>
                <ProductLabel
                  className="block text-sm font-medium mb-1"
                  htmlFor="userName"
                >
                  Tên người dùng
                </ProductLabel>
                <ProductInputField
                  type="text"
                  id="userName"
                  value={editUser.userName}
                  onChange={(e) =>
                    setEditUser({ ...editUser, userName: e.target.value })
                  }
                />
              </div>
              <div>
                <ProductLabel
                  className="block text-sm font-medium mb-1"
                  htmlFor="birthday"
                >
                  Ngày sinh
                </ProductLabel>
                <ProductDatePicker
                  id="birthday"
                  defaultDate={editUser.birthday}
                  onChange={(dates) =>
                    setEditUser({
                      ...editUser,
                      birthday:
                        dates && dates[0]
                          ? formatDateLocal(dates[0])
                          : "",
                    })
                  }
                />
              </div>
              <div>
                <ProductLabel
                  className="block text-sm font-medium mb-1"
                  htmlFor="phoneNumber"
                >
                  Số điện thoại
                </ProductLabel>
                <ProductInputField
                  type="text"
                  id="phoneNumber"
                  value={editUser.phoneNumber}
                  onChange={(e) =>
                    setEditUser({ ...editUser, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div>
                <ProductLabel
                  className="block text-sm font-medium mb-1"
                  htmlFor="role"
                >
                  Vai trò
                </ProductLabel>
                <ReactSelect
                  id="role"
                  options={roleOptions}
                  value={roleOptions.find(
                    (role) => role.value === editUser.roleId
                  )}
                  onChange={(e) =>
                    setEditUser(
                      editUser
                        ? {
                            ...editUser,
                            roleId:
                              typeof e?.value === "number"
                                ? e.value
                                : editUser.roleId,
                          }
                        : null
                    )
                  }
                  placeholder="Chọn vai trò"
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  isLoading={loading}
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
                      backgroundColor: state.isFocused ? "#f3f4f6" : "white",
                      color: "black",
                    }),
                  }}
                />
              </div>
              <Button
                className="bg-[#334357] text-white font-semibold text-md h-[44px]"
                onClick={() => editUser && handleUpdateUser(editUser)}
              >
                Cập nhật
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
export default observer(UserTableComponent);
