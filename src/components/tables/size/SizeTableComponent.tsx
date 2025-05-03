import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { ProductSizeDto } from '../../../app/models/product/productSize.model.ts'
import { useNavigate } from 'react-router'

interface SizeTableComponentProps {
  data: ProductSizeDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

export default function SizeTableComponent({ data }: SizeTableComponentProps) {
  const [selectedProducts, setSelectedProducts] = useState<ProductSizeDto[]>([]);
  const navigate = useNavigate();

  const handleView = (size: ProductSizeDto) => {
    navigate("/sizes/detail/" + size.id);
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductSizeDto[];
  }) => {
    setSelectedProducts(state.selectedRows);
    console.log('Selected Sizes:', state.selectedRows);
    console.log(selectedProducts)
  };

  const columns: TableColumn<ProductSizeDto>[] = [
    {
      name: 'STT',
      selector: row => row.id,
      sortable: true,
      maxWidth: '5px'
    },
    {
      name: 'Dài',
      selector: row => row.length,
      sortable: true,
    },
    {
      name: 'Rộng',
      selector: row => row.wide,
      sortable: true,
    },
    {
      name: 'Kích cỡ tự động',
      selector: row => row.autoSized,
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
      />
    </div>
  );
}
