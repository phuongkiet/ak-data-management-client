import DataTable, { TableColumn } from 'react-data-table-component';
// import Badge from '../../ui/badge/Badge';
import { StrategyProductDto } from '../../../app/models/product/product.model.ts'
import { appCurrency } from '../../../app/common/common.ts';
import { observer } from 'mobx-react-lite';
import {  useNavigate } from 'react-router';

interface StrategyProductTableComponentProps {
  data: StrategyProductDto[];
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (newPageSize: number, page: number) => void;
  totalCount: number;
  searchTerm: string;
  onSelectedIdsChange?: (ids: number[]) => void;
}

const StrategyProductTableComponent = ({ data, loading, currentPage, onPageChange, onPageSizeChange, totalCount, onSelectedIdsChange }: StrategyProductTableComponentProps) => {
  const navigate = useNavigate();

  const handleView = (product: StrategyProductDto) => {
    navigate("/strategy-products/detail/" + product.id);
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: StrategyProductDto[];
  }) => {
    if (onSelectedIdsChange) {
      onSelectedIdsChange(state.selectedRows.map(row => row.id));
    }
  };

  const columns: TableColumn<StrategyProductDto>[] = [
    {
      name: 'Id',
      selector: row => row.id,
      sortable: true,
      maxWidth: '3px'
    },
    {
      name: 'Mã nhà cung cấp',
      selector: row => row.supplierItemCode,
    },
    {
      name: 'Tên hiển thị website',
      selector: row => row.displayWebsiteName.slice(0, 25),
      sortable: true,
    },
    {
      name: 'Giá trên web',
      selector: row => row.webProductPrice?.toLocaleString() ? appCurrency + row.webProductPrice?.toLocaleString() : 'Chưa có',
      sortable: true,
    },
    {
      name: 'Giá khuyến mãi',
      selector: row => row.webDiscountedPrice?.toLocaleString() ? appCurrency + row.webDiscountedPrice?.toLocaleString() : 'Chưa có',
      sortable: true,
    },
    {
      name: 'Giá bán lẻ của NCC',
      selector: row => row.retailPrice?.toLocaleString() ? appCurrency + row.retailPrice?.toLocaleString() : 'Chưa có',
      sortable: true,
    },
    {
      name: 'Chính sách chuẩn',
      selector: row => row.policyStandard?.toLocaleString() ? row.policyStandard?.toLocaleString() + "%" : 'Chưa có',
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
        paginationServer
        paginationTotalRows={totalCount}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
        paginationDefaultPage={currentPage}
        onChangePage={onPageChange}
        onChangeRowsPerPage={onPageSizeChange}
        responsive
        highlightOnHover
        striped
        selectableRows
        onSelectedRowsChange={handleSelectedRowsChange}
        progressPending={loading}
        progressComponent={
          <div className="py-8 text-center font-semibold font-roboto w-full">
            Đang chờ...
          </div>
        }
        noDataComponent={
          <div className="py-8 text-center font-semibold font-roboto w-full">
            Không có dữ liệu.
          </div>
        }
      />
    </div>
  );
}

export default observer(StrategyProductTableComponent);