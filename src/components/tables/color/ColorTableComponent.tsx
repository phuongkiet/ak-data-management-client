import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { ProductColorDto } from '../../../app/models/product/productColor.model.ts'
import { useNavigate } from 'react-router'
import { useStore } from '../../../app/stores/store.ts';

interface ColorTableComponentProps {
  data: ProductColorDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

export default function ColorTableComponent({ data }: ColorTableComponentProps) {
  const { colorStore } = useStore();
  const { loading } = colorStore;
  const [selectedProducts, setSelectedProducts] = useState<ProductColorDto[]>([]);
  const navigate = useNavigate();

  const handleView = (color: ProductColorDto) => {
    navigate("/colors/detail/" + color.id);
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductColorDto[];
  }) => {
    setSelectedProducts(state.selectedRows);
    console.log('Selected Colors:', state.selectedRows);
    console.log(selectedProducts)
  };

  const columns: TableColumn<ProductColorDto>[] = [
    {
      name: 'STT',
      selector: row => row.id,
      sortable: true,
      maxWidth: '5px'
    },
    {
      name: 'Màu',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Mã màu',
      selector: row => row.colorHexCode || 'Không tìm thấy',
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
        noDataComponent={<div className="py-8 text-center font-semibold font-roboto w-full">Không có dữ liệu để hiển thị.</div>}
      />
    </div>
  );
}
