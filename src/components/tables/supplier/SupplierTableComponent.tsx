import DataTable, { TableColumn } from 'react-data-table-component';
import { ProductSupplierDto } from '../../../app/models/product/productSupplier.model.ts'
import { useNavigate } from 'react-router'
import { useStore } from '../../../app/stores/store.ts';
import { useTheme } from "../../../app/context/ThemeContext";
import { FaEye } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

interface SupplierTableComponentProps {
  data: ProductSupplierDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  searchTerm: string;
}

export default function SupplierTableComponent({ data }: SupplierTableComponentProps) {
  const { supplierStore } = useStore();
  const { loading } = supplierStore;
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleView = (supplier: ProductSupplierDto) => {
    navigate("/suppliers/detail/" + supplier.id);
  };

  const columns: TableColumn<ProductSupplierDto>[] = [
    {
      name: 'STT',
      selector: row => row.id,
      sortable: true,
      maxWidth: '5px'
    },
    {
      name: 'Tên',
      selector: row => row.supplierName,
      sortable: true,
    },
    {
      name: 'Mã nhà cung cấp',
      selector: row => row.supplierCodeName,
      sortable: true,
    },
    {
      name: 'Mã ngắn',
      selector: row => row.supplierShortCode,
      sortable: true,
    },
    {
      name: 'Hành động',
      cell: row => (
        <button
          onClick={() => handleView(row)}
          className="text-blue-600 hover:underline font-medium"
          data-tooltip-id="view-tooltip"
          data-tooltip-content="Xem"
        >
          <FaEye className="w-6 h-6 hover:opacity-50" />
          <Tooltip id="view-tooltip" className="text-md" />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-[#1a1f2e]/[0.03] p-4">
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
        progressComponent={<div className="py-8 text-center font-semibold font-roboto w-full">Đang chờ...</div>}
        noDataComponent={<div className="py-8 text-center font-semibold font-roboto w-full">Không có dữ liệu để hiển thị.</div>}
      />
    </div>
  );
}
