import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Badge from "../../ui/badge/Badge";
import { ProductDto } from "../../../app/models/product/product.model.ts";
import { useNavigate } from "react-router";

interface ProductTableComponentProps {
  data: ProductDto[];
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (newPageSize: number, page: number) => void;
  totalCount: number;
}

export default function ProductTableComponent({
  data,
  loading,
  currentPage,
  onPageChange,
  onPageSizeChange,
  totalCount,
}: ProductTableComponentProps) {
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
    console.log("Selected Products:", state.selectedRows);
    console.log(selectedProducts);
  };

  const columns: TableColumn<ProductDto>[] = [
    {
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
      maxWidth: "5px",
    },
    {
      name: "Mã hàng",
      selector: (row) => row.confirmProductCode,
      sortable: true,
    },
    {
      name: "Mã nhà cung cấp",
      selector: (row) => row.supplierCode,
    },
    {
      name: "Mã hàng nhà cung cấp",
      selector: (row) => row.confirmSupplierItemCode,
      sortable: true,
      minWidth: "180px",
      wrap: false,
      cell: (row) => (
        <div className="w-full h-full flex items-center bg-blue-700 text-white py-2 pl-3">
          {row.confirmSupplierItemCode}
        </div>
      ),
    },
    {
      name: "Giá gốc",
      selector: (row) => row.productPrice?.toLocaleString() ?? "Chưa có giá",
      sortable: true,
    },
    {
      name: "Giá khuyến mãi",
      selector: (row) => row.discountedPrice?.toLocaleString() ?? "Chưa có giá",
      sortable: true,
    },
    {
      name: "Người đăng",
      selector: (row) => row.creator ?? "Chưa có người đăng",
    },
    {
      name: "Tình trạng Upload",
      selector: (row) => row.uploadWebsiteStatus,
      sortable: true,
      cell: (row) => (
        <Badge
          size="sm"
          color={
            row.uploadWebsiteStatus === "Uploaded"
              ? "success"
              : row.uploadWebsiteStatus === "Pending"
              ? "warning"
              : "error"
          }
        >
          {row.uploadWebsiteStatus}
        </Badge>
      ),
    },
    {
      name: "Hành động",
      cell: (row) => (
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
    },
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
      />
    </div>
  );
}
