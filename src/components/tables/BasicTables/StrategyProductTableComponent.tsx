import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
// import Badge from '../../ui/badge/Badge';
import { StrategyProductDto } from '../../../app/models/product/product.model.ts'

interface StrategyProductTableComponentProps {
  data: StrategyProductDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

export default function StrategyProductTableComponent({ data }: StrategyProductTableComponentProps) {
  const [selectedStrategyProducts, setSelectedStrategyProducts] = useState<StrategyProductDto[]>([]);

  const handleView = (product: StrategyProductDto) => {
    console.log('Xem sản phẩm:', product);
    // hoặc điều hướng sang trang chi tiết, mở modal,...
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: StrategyProductDto[];
  }) => {
    setSelectedStrategyProducts(state.selectedRows);
    console.log('Selected Products:', state.selectedRows);
    console.log(selectedStrategyProducts)
  };

  const columns: TableColumn<StrategyProductDto>[] = [
    {
      name: 'Id',
      selector: row => row.id,
      sortable: true,
      maxWidth: '5px'
    },
    // {
    //   name: 'Mã vạch',
    //   selector: row => row.confirmAutoBarCode,
    //   sortable: true,
    // },
    // {
    //   name: 'Tên nhà cung cấp',
    //   selector: row => row.supplierName,
    // },
    {
      name: 'Mã nhà cung cấp',
      selector: row => row.supplierItemCode,
    },
    {
      name: 'Tên hiển thị website',
      selector: row => row.displayWebsiteName,
      sortable: true,
    },
    {
      name: 'Giá trên web',
      selector: row => row.webProductPrice?.toLocaleString() ?? '',
      sortable: true,
    },
    {
      name: 'Giá khuyến mãi',
      selector: row => row.webDiscountedPrice?.toLocaleString() ?? '',
      sortable: true,
    },
    {
      name: 'Kích thước thực tế',
      selector: row => row.size,
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
