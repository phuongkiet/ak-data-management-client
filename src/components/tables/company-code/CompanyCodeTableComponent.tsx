import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { CompanyCodeDto } from '../../../app/models/product/companyCode.model.ts'
import { useNavigate } from 'react-router'
import { useStore } from '../../../app/stores/store.ts';

interface CompanyCodeTableComponentProps {
  data: CompanyCodeDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

export default function CompanyCodeTableComponent({ data }: CompanyCodeTableComponentProps) {
  const { companyCodeStore } = useStore();
  const { loading } = companyCodeStore;
  const [selectedProducts, setSelectedProducts] = useState<CompanyCodeDto[]>([]);
  const navigate = useNavigate();

  const handleView = (companyCode: CompanyCodeDto) => {
    navigate("/company-codes/detail/" + companyCode.id);
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: CompanyCodeDto[];
  }) => {
    setSelectedProducts(state.selectedRows);
    console.log('Selected Company Codes:', state.selectedRows);
    console.log(selectedProducts)
  };

  const columns: TableColumn<CompanyCodeDto>[] = [
    {
      name: 'STT',
      selector: row => row.id,
      sortable: true,
      maxWidth: '5px'
    },
    {
      name: 'Mã',
      selector: row => row.codeName,
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
