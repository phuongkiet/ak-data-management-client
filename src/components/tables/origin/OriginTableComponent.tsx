import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { ProductOriginDto } from '../../../app/models/product/productOrigin.model.ts'
import { useNavigate } from 'react-router'
import { useStore } from '../../../app/stores/store.ts';
interface OriginTableComponentProps {
  data: ProductOriginDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

export default function OriginTableComponent({ data }: OriginTableComponentProps) {
  const { originStore } = useStore();
  const { loading } = originStore;
  const [selectedProducts, setSelectedProducts] = useState<ProductOriginDto[]>([]);
  const navigate = useNavigate();

  const handleView = (origin: ProductOriginDto) => {
    navigate("/origins/detail/" + origin.id);
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductOriginDto[];
  }) => {
    setSelectedProducts(state.selectedRows);
    console.log('Selected Origins:', state.selectedRows);
    console.log(selectedProducts)
  };

  const columns: TableColumn<ProductOriginDto>[] = [
    {
      name: 'STT',
      selector: row => row.id,
      sortable: true,
      maxWidth: '5px'
    },
    {
      name: 'Xuất xứ',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Mã',
      selector: row => row.upperName,
      sortable: true,
    },
    {
      name: 'Hành động',
      cell: row => (
        <button
          onClick={() => handleView(row)}
          className="text-blue-600 hover:underline font-medium"
        >
          Xem
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
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
      />
    </div>
  );
}
