import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { ProductStorageDto } from '../../../app/models/product/productStorage.model.ts'
import { useNavigate } from 'react-router'
import { useStore } from '../../../app/stores/store.ts';
interface StorageTableComponentProps {
  data: ProductStorageDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

export default function StorageTableComponent({ data }: StorageTableComponentProps) {
  const { storageStore } = useStore();
  const { loading } = storageStore;
  const [selectedProducts, setSelectedProducts] = useState<ProductStorageDto[]>([]);
  const navigate = useNavigate();

  const handleView = (storage: ProductStorageDto) => {
    navigate("/storages/detail/" + storage.id);
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductStorageDto[];
  }) => {
    setSelectedProducts(state.selectedRows);
    console.log('Selected Storages:', state.selectedRows);
    console.log(selectedProducts)
  };

  const columns: TableColumn<ProductStorageDto>[] = [
    {
      name: 'STT',
      selector: row => row.id,
      sortable: true,
      maxWidth: '5px'
    },
    {
      name: 'Hình thức',
      selector: row => row.name,
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
