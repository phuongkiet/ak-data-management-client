import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
// import { useNavigate } from 'react-router'
import { useStore } from '../../../app/stores/store.ts';
import { UserDto } from '../../../app/models/user/user.model.ts';
import Badge from '../../ui/badge/Badge.tsx';
interface UserTableComponentProps {
  data: UserDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

export default function UserTableComponent({ data }: UserTableComponentProps) {
  const { userStore } = useStore();
  const { loading } = userStore;
  const [selectedUsers, setSelectedUsers] = useState<UserDto[]>([]);
  // const navigate = useNavigate();

  // const handleView = (user: UserDto) => {
  //   navigate("/users/detail/" + user.id);
  // };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: UserDto[];
  }) => {
    setSelectedUsers(state.selectedRows);
    console.log('Selected Users:', state.selectedRows);
    console.log(selectedUsers)
  };

  const columns: TableColumn<UserDto>[] = [
    {
      name: 'STT',
      selector: row => row.id,
      sortable: true,
      maxWidth: '5px'
    },
    {
      name: 'Tên',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Số điện thoại',
      selector: row => row.phoneNumber,
      sortable: true,
    },
    {
      name: 'Vai trò',
      selector: (row: any) => {
        const roleMap: Record<string, string> = {
          'Admin': 'Quản trị viên',
          'Strategist': 'Chiến lược gia',
          'Client': 'Người dùng',
        };
        if (Array.isArray(row.role)) {
          return row.role.map((r: string) => roleMap[r] || r).join(", ");
        }
        return roleMap[row.role as string] || row.role;
      },
      sortable: true,
    },
    {
      name: 'Trạng thái',
      selector: row => row.status,
      sortable: true,
      cell: row => {
        const isActive = row.status === 1 ? "Đang hoạt động" : "Đã khóa";
        return (
          <Badge size="sm" color={isActive ? "success" : "error"}>
            {isActive}
          </Badge>
        );
      }
    },
    // {
    //   name: 'Hành động',
    //   cell: row => (
    //     <button
    //       onClick={() => handleView(row)}
    //       className="text-blue-600 hover:underline font-medium"
    //     >
    //       Xem
    //     </button>
    //   ),
    //   ignoreRowClick: true,
    //   allowOverflow: true,
    //   button: true,
    // }
  ];

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
      <DataTable
        columns={columns}
        data={data}
        pagination
        responsive
        highlightOnHover
        striped
        selectableRows
        onSelectedRowsChange={handleSelectedRowsChange}
        progressPending={loading}
        progressComponent={<div className="py-8 text-center font-semibold font-roboto w-full">Đang chờ...</div>}
        noDataComponent={<div className="py-8 text-center font-semibold font-roboto w-full">Không có dữ liệu để hiển thị.</div>}
      />
    </div>
  );
}
