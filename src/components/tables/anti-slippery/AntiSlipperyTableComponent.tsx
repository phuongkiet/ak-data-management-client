import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { ProductAntiSlipperyDto } from '../../../app/models/product/productAntiSlippery.model.ts'
import { useNavigate } from 'react-router'
import { useStore } from '../../../app/stores/store.ts';

interface AntiSlipperyTableComponentProps {
  data: ProductAntiSlipperyDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

export default function AntiSlipperyTableComponent({ data }: AntiSlipperyTableComponentProps) {
  const { antiSlipperyStore } = useStore();
  const { loading } = antiSlipperyStore;
  const [selectedProducts, setSelectedProducts] = useState<ProductAntiSlipperyDto[]>([]);
  const navigate = useNavigate();

  const handleView = (antiSlip: ProductAntiSlipperyDto) => {
    navigate("/anti-slipperys/detail/" + antiSlip.id);
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductAntiSlipperyDto[];
  }) => {
    setSelectedProducts(state.selectedRows);
    console.log('Selected Anti Slippery:', state.selectedRows);
    console.log(selectedProducts)
  };

  const columns: TableColumn<ProductAntiSlipperyDto>[] = [
    {
      name: 'STT',
      selector: row => row.id,
      sortable: true,
      maxWidth: '5px'
    },
    {
      name: 'Mức độ chống trượt',
      selector: row => row.antiSlipLevel,
      sortable: true,
    },
    {
      name: 'Mô tả',
      selector: row => row.description ? row.description : 'Không có mô tả',
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
