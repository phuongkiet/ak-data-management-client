import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
// import Badge from '../../ui/badge/Badge';
import { StrategyProductDto } from '../../../app/models/product/product.model.ts'
import { appCurrency } from '../../../app/common/common.ts';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store.ts';

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

const StrategyProductTableComponent = ({ data }: StrategyProductTableComponentProps) => {
  const { productStore } = useStore();
  const { loading } = productStore;
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
      selector: row => appCurrency + row.webProductPrice?.toLocaleString(),
      sortable: true,
    },
    {
      name: 'Giá khuyến mãi',
      selector: row => appCurrency + row.webDiscountedPrice?.toLocaleString(),
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
        progressPending={loading}
        progressComponent={<div className="py-8 text-center font-semibold font-roboto w-full">Đang chờ...</div>}
      />
    </div>
  );
}

export default observer(StrategyProductTableComponent);