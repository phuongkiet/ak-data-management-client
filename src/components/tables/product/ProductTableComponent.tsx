import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import Badge from '../../ui/badge/Badge';
import { ProductDto } from '../../../app/models/product/product.model.ts';
import { useNavigate } from 'react-router'

interface ProductTableComponentProps {
  data: ProductDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

export default function ProductTableComponent({ data }: ProductTableComponentProps) {
  const [selectedProducts, setSelectedProducts] = useState<ProductDto[]>([]);
  const navigate = useNavigate();

  const handleView = (product: ProductDto) => {
    navigate("/products/detail/" + product.id);
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductDto[];
  }) => {
    setSelectedProducts(state.selectedRows);
    console.log('Selected Products:', state.selectedRows);
    console.log(selectedProducts)
  };

  const columns: TableColumn<ProductDto>[] = [
    {
      name: 'Id',
      selector: row => row.id,
      sortable: true,
      maxWidth: '5px'
    },
    {
      name: 'Mã hàng',
      selector: row => row.confirmProductCode,
      sortable: true,
    },
    {
      name: 'Mã nhà cung cấp',
      selector: row => row.supplierCode,
    },
    {
      name: 'Mã hàng nhà cung cấp',
      selector: row => row.confirmSupplierItemCode,
      sortable: true,
      cell: row => (
        <div className="bg-blue-700 text-white p-2">
          {row.confirmSupplierItemCode}
        </div>
      ),
    },
    {
      name: 'Giá gốc',
      selector: row => row.productPrice?.toLocaleString() ?? '',
      sortable: true,
    },
    {
      name: 'Giá khuyến mãi',
      selector: row => row.discountedPrice?.toLocaleString() ?? '',
      sortable: true,
    },
    {
      name: 'Người đăng',
      selector: row => row.creator,
    },
    {
      name: 'Tình trạng Upload',
      selector: row => row.uploadWebsiteStatus,
      sortable: true,
      cell: row => (
        <Badge
          size="sm"
          color={
            row.uploadWebsiteStatus === 'Uploaded'
              ? 'success'
              : row.uploadWebsiteStatus === 'Pending'
                ? 'warning'
                : 'error'
          }
        >
          {row.uploadWebsiteStatus}
        </Badge>
      ),
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
