import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { ProductSupplierDto } from '../../../app/models/product/productSupplier.model.ts'
import { useNavigate } from 'react-router'

interface SupplierTableComponentProps {
  data: ProductSupplierDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

export default function SupplierTableComponent({ data }: SupplierTableComponentProps) {
  const [selectedProducts, setSelectedProducts] = useState<ProductSupplierDto[]>([]);
  const navigate = useNavigate();

  const handleView = (supplier: ProductSupplierDto) => {
    navigate("/suppliers/detail/" + supplier.id);
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductSupplierDto[];
  }) => {
    setSelectedProducts(state.selectedRows);
    console.log('Selected Suppliers:', state.selectedRows);
    console.log(selectedProducts)
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
      name: 'Mã',
      selector: row => row.supplierCode,
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
