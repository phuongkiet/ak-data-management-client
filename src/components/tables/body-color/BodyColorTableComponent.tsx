import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { ProductBodyColorDto } from '../../../app/models/product/productBodyColor.model.ts'
import { useNavigate } from 'react-router'
import { useStore } from '../../../app/stores/store.ts';

interface BodyColorTableComponentProps {
  data: ProductBodyColorDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

export default function BodyColorTableComponent({ data }: BodyColorTableComponentProps) {
  const { bodyColorStore } = useStore();
  const { loading } = bodyColorStore;
  const [selectedProducts, setSelectedProducts] = useState<ProductBodyColorDto[]>([]);
  const navigate = useNavigate();

  const handleView = (bodyColor: ProductBodyColorDto) => {
    navigate("/body-colors/detail/" + bodyColor.id);
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductBodyColorDto[];
  }) => {
    setSelectedProducts(state.selectedRows);
    console.log('Selected Body Colors:', state.selectedRows);
    console.log(selectedProducts)
  };

  const columns: TableColumn<ProductBodyColorDto>[] = [
    {
      name: 'STT',
      selector: row => row.id,
      sortable: true,
      maxWidth: '5px'
    },
    {
      name: 'Thân gạch',
      selector: row => row.name,
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
