import { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Badge from "../../ui/badge/Badge";
import {
  ProductDetail,
  ProductDto,
} from "../../../app/models/product/product.model.ts";
import { useNavigate } from "react-router";
import {
  appCurrency,
  uploadWebsiteStatusToVietnamese,
} from "../../../app/common/common";
import Modal from "../../ui/modal/index.tsx";
import { useStore } from "../../../app/stores/store.ts";
import { observer } from "mobx-react-lite";
import ProductLabel from "../../form/product-form/ProductLabel.tsx";
import ProductInputField from "../../form/product-form/input/ProductInputField.tsx";
import ProductTextArea from "../../form/product-form/input/ProductTextArea.tsx";

interface ProductTableComponentProps {
  data: ProductDto[];
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (newPageSize: number, page: number) => void;
  totalCount: number;
}

const ProductTableComponent = ({
  data,
  loading,
  currentPage,
  onPageChange,
  onPageSizeChange,
  totalCount,
}: ProductTableComponentProps) => {
  const [selectedProducts, setSelectedProducts] = useState<ProductDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDetail | null>();
  const [technicalInfo, setTechnicalInfo] = useState("");
  const [storageCheckingCode, setStorageCheckingCode] = useState("");
  const navigate = useNavigate();
  const { productStore } = useStore();

  

  useEffect(() => {
    if (!selectedProduct) {
      setTechnicalInfo("");
      return;
    }
    setTechnicalInfo(
`Trọng lượng: ${selectedProduct.weightPerUnit} kg / Viên ~ ${selectedProduct.weightPerBox} kg / Thùng
M² / thùng: ${selectedProduct.areaPerBox} m² / thùng
Chống trượt: ${selectedProduct.isAntiFouling ? "❌" : "✅"}
Độ hút nước: ≤ ${selectedProduct.waterAbsorption} %
Chống bám bẩn: ${selectedProduct.isAntiFouling ? "✅" : "❌"}
Dùng lát nền: ${selectedProduct.isFlooring ? "✅" : "❌"}
Dùng ốp tường: ${selectedProduct.isWalling ? "✅" : "❌"}
Sử dụng trong nhà: ${selectedProduct.isInside ? "✅" : "❌"}
Sử dụng ngoài trời: ${selectedProduct.isOutside ? "✅" : "❌"}
Sản phẩm mài cạnh: ${selectedProduct.isEdgeGrinding ? "✅" : "❌"}`
    );
  }, [selectedProduct]);

  const handleView = (product: ProductDto) => {
    navigate("/products/detail/" + product.id);
  };

  const handleViewUploadWebsite = async (id: number) => {
    try {
      await productStore.loadProductDetail(id);
      setSelectedProduct(productStore.productDetail);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error loading product:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
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
      maxWidth: "3px",
      wrap: false,
    },
    {
      name: "Mã hàng",
      selector: (row) => row.confirmAutoBarCode,
      sortable: true,
    },
    {
      name: "Mã NCC",
      selector: (row) => row.supplierCode,
    },
    {
      name: "Mã hàng NCC",
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
      selector: (row) =>
        row.productPrice?.toLocaleString()
          ? appCurrency + "" + row.productPrice?.toLocaleString()
          : "Chưa có giá",
      sortable: true,
    },
    {
      name: "Giá khuyến mãi",
      selector: (row) =>
        row.discountedPrice?.toLocaleString()
          ? appCurrency + "" + row.discountedPrice?.toLocaleString()
          : "Chưa có giá",
      sortable: true,
    },
    {
      name: "Đăng",
      selector: (row) => row.creator ?? "Chưa có người đăng",
    },
    {
      name: "Sửa",
      selector: (row) => row.modifier ?? "Chưa có người sửa",
    },
    {
      name: "Tình trạng Upload",
      selector: (row) => row.uploadWebsiteStatus,
      sortable: true,
      cell: (row) => {
        const isUploaded =
          Number(row.uploadWebsiteStatus) === 1 ||
          row.uploadWebsiteStatus === "Uploaded";
        return (
          <Badge size="sm" color={isUploaded ? "success" : "error"}>
            {uploadWebsiteStatusToVietnamese(row.uploadWebsiteStatus)}
          </Badge>
        );
      },
    },
    {
      name: "Hành động",
      cell: (row) => (
        <div>
          <button
            onClick={() => handleViewUploadWebsite(row.id)}
            className="text-blue-600 hover:underline font-medium"
          >
            Website
          </button>
          <span> / </span>
          <button
            onClick={() => handleView(row)}
            className="text-blue-600 hover:underline font-medium"
          >
            Xem
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        className="w-full max-w-[1100px] px-20"
      >
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold my-5 text-center">
            THÔNG TIN WEBSITE GẠCH ỐP LÁT
          </h2>
          {selectedProduct ? (
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                {/* First row - Short Code and Supplier Item Code */}
                <div>
                  <ProductLabel className="text-sm mb-1">
                    Mã ngắn - sản phẩm:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-xs w-full"
                    value={selectedProduct.confirmAutoBarCode}
                    disabled
                  />
                </div>
                <div>
                  <ProductLabel className="text-sm text-red-500 mb-1">
                    Mã kiểm kho:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-xs w-full"
                    value={selectedProduct.confirmSupplierItemCode}
                    disabled
                  />
                </div>

                {/* Second row - Product Code */}
                <div className="col-span-2">
                  <ProductLabel className="text-sm mb-1">
                    Mã sản phẩm:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-xs w-full"
                    value={selectedProduct.productCode}
                    disabled
                  />
                </div>

                {/* Third row - Unit and Delivery Date */}
                <div>
                  <ProductLabel className="text-sm text-red-500 mb-1">
                    ĐVT:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-xs w-full"
                    value={selectedProduct.autoCalculatedUnit}
                    disabled
                  />
                </div>
                <div>
                  <ProductLabel className="text-sm mb-1">
                    Thời gian giao hàng:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-xs w-full"
                    value={selectedProduct.deliveryEstimatedDate}
                    disabled
                  />
                </div>

                {/* Technical Info */}
                <div className="col-span-2">
                  <ProductLabel className="text-sm mb-1">
                    Thông tin kỹ thuật:
                  </ProductLabel>
                  <ProductTextArea
                    className="h-32 w-full text-lg border-gray-300 bg-gray-100 p-2"
                    value={technicalInfo}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                {/* Price Information */}
                <div className="col-span-4">
                  <ProductLabel className="text-sm font-bold mb-1">
                    Giá sản phẩm:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-xs w-full"
                    value={selectedProduct.productPrice}
                    disabled
                  />
                </div>
                <div className="col-span-4">
                  <ProductLabel className="text-sm font-bold mb-1">
                    Giá khuyến mãi 1:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-xs w-full"
                    value={selectedProduct.discountedPrice}
                    disabled
                  />
                </div>
                <div className="col-span-4">
                  <ProductLabel className="text-sm font-bold mb-1">
                    Giá khuyến mãi 2:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-xs w-full"
                    value={selectedProduct.secondDiscountedPrice}
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                {/* Quantity and Weight Information */}
                <div className="col-span-4">
                  <ProductLabel className="text-sm font-bold mb-1">
                    Viên/thùng:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-xs w-full"
                    value={selectedProduct.quantityPerBox}
                    disabled
                  />
                </div>
                <div className="col-span-4">
                  <ProductLabel className="text-sm font-bold mb-1">
                    Kg/thùng:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-xs w-full"
                    value={selectedProduct.weightPerBox}
                    disabled
                  />
                </div>
                <div className="col-span-4">
                  <ProductLabel className="text-sm font-bold mb-1">
                    Kg/Viên:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-xs w-full"
                    value={selectedProduct.weightPerUnit}
                    disabled
                  />
                </div>
              </div>

              {/* Product Details */}
              <div>
                <ProductLabel className="text-sm font-bold mb-1">
                  Bề mặt:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-xs w-full"
                  value={selectedProduct.surfaceFeatureId}
                  disabled
                />
              </div>
              <div>
                <ProductLabel className="text-sm font-bold mb-1">
                  Chất liệu:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-xs w-full"
                  value={selectedProduct.materialId}
                  disabled
                />
              </div>
              <div>
                <ProductLabel className="text-sm font-bold mb-1">
                  Kích thước:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-xs w-full"
                  value={selectedProduct.autoGeneratedSize}
                  disabled
                />
              </div>
              <div>
                <ProductLabel className="text-sm font-bold mb-1">
                  Màu sắc:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-xs w-full"
                  value={selectedProduct.colorId}
                  disabled
                />
              </div>
              <div>
                <ProductLabel className="text-sm font-bold mb-1">
                  Số lượng vân:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-xs w-full"
                  value={selectedProduct.patternQuantity}
                  disabled
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-4">Đang tải thông tin...</div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default observer(ProductTableComponent);
