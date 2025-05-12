import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { ProductProcessingDto } from '../../../app/models/product/productProcessing.model.ts'
import { useNavigate } from 'react-router'
import { useStore } from '../../../app/stores/store.ts';
interface ProcessingTableComponentProps {
  data: ProductProcessingDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

export default function ProcessingTableComponent({ data }: ProcessingTableComponentProps) {
  const { processingStore } = useStore();
  const { loading } = processingStore;
  const [selectedProducts, setSelectedProducts] = useState<ProductProcessingDto[]>([]);
  const navigate = useNavigate();

  const handleView = (processing: ProductProcessingDto) => {
    navigate("/processings/detail/" + processing.id);
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductProcessingDto[];
  }) => {
    setSelectedProducts(state.selectedRows);
    console.log('Selected Processings:', state.selectedRows);
    console.log(selectedProducts)
  };

  const columns: TableColumn<ProductProcessingDto>[] = [
    {
      name: 'STT',
      selector: row => row.id,
      sortable: true,
      maxWidth: '5px'
    },
    {
      name: 'Mã gia công',
      selector: row => row.processingCode,
      sortable: true,
    },
    {
      name: 'Mô tả',
      selector: row => row.processingDescription ? row.processingDescription : "Không có mô tả",
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
