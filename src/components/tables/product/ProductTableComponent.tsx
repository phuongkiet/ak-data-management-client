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
import ProductInputField from "../../form/product-form/input/product/ProductInputField.tsx";
import ProductTextArea from "../../form/product-form/input/product/ProductTextArea.tsx";
import { NumericFormat } from "react-number-format";

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
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDetail | null>();
  const [technicalInfo, setTechnicalInfo] = useState("");
  const [storageCheckingCode, setStorageCheckingCode] = useState("");
  const [storageName, setStorageName] = useState("");
  const [productSurface, setProductSurface] = useState("");
  const [productMaterial, setProductMaterial] = useState("");
  const [productColor, setProductColor] = useState("");
  const [productSize, setProductSize] = useState("");
  const [displayWebsiteName, setDisplayWebsiteName] = useState("");
  const navigate = useNavigate();
  const {
    productStore,
    storageStore,
    waterAbsorptionStore,
    patternStore,
    sizeStore,
    surfaceStore,
    materialStore,
    colorStore,
    antiSlipperyStore,
  } = useStore();

  useEffect(() => {
    storageStore.loadStorages();
    waterAbsorptionStore.loadWaterAbsorption();
    patternStore.loadPatterns();
    sizeStore.loadSizes();
    surfaceStore.loadSurfaces();
    materialStore.loadMaterials();
    colorStore.loadColors();
    antiSlipperyStore.loadAntiSlipperys();
  }, []);

  useEffect(() => {
    if (!selectedProduct) {
      setTechnicalInfo("");
      setStorageCheckingCode("");
      setStorageName("");
      return;
    }

    const storage = storageStore.productStorageList.find(
      (x) => x.id === selectedProduct?.storageId
    );
    setStorageName(storage?.name ?? "");

    const water = waterAbsorptionStore.productWaterAbsorptionList.find(
      (x) => x.id === selectedProduct?.waterAbsorptionId
    );
    const waterAbsorptionValue = water?.waterAbsoprtionLevel ?? "";

    const surface = surfaceStore.productSurfaceList.find(
      (x) => x.id === selectedProduct?.surfaceFeatureId
    );
    setProductSurface(surface?.name ?? "");

    const material = materialStore.productMaterialList.find(
      (x) => x.id === selectedProduct?.materialId
    );
    setProductMaterial(material?.name ?? "");

    const color = colorStore.productColorList.find(
      (x) => x.id === selectedProduct?.colorId
    );
    setProductColor(color?.name ?? "");

    const pattern = patternStore.productPatternList.find(
      (x) => x.id === selectedProduct?.brickPatternId
    );

    const size = sizeStore.productSizeList.find(
      (x) => x.id === selectedProduct?.actualSizeId
    );
    const actualSize = size
      ? `${Number(size.length) / 10} x ${Number(size.wide) / 10} cm`
      : "";

    const displayWebsiteSize =
      actualSize + " x " + selectedProduct.thicknessSize + " | mm";
    setProductSize(displayWebsiteSize);

    setDisplayWebsiteName(
      `${selectedProduct.confirmAutoBarCode} ${
        pattern?.name ?? ""
      } ${actualSize}`.trim()
    );

    setStorageCheckingCode(
      selectedProduct.confirmAutoBarCode.replace(/\./g, "")
    );

    if (
      selectedProduct.antiSlipId == 1 ||
      selectedProduct.antiSlipId == 14 ||
      selectedProduct.antiSlipId == 15
    ) {
      setTechnicalInfo(
        `Trọng lượng: ${selectedProduct.weightPerUnit} kg / Viên ~ ${
          selectedProduct.weightPerBox
        } kg / Thùng
M² / thùng: ${selectedProduct.areaPerBox} m² / thùng
Chống trượt: ${"❌"}
Độ hút nước: ${waterAbsorptionValue}
Chống bám bẩn: ${selectedProduct.isAntiFouling ? "✅" : "❌"}
Dùng lát nền: ${selectedProduct.isFlooring ? "✅" : "❌"}
Dùng ốp tường: ${selectedProduct.isWalling ? "✅" : "❌"}
Sử dụng trong nhà: ${selectedProduct.isInside ? "✅" : "❌"}
Sử dụng ngoài trời: ${selectedProduct.isOutside ? "✅" : "❌"}
Sản phẩm mài cạnh: ${selectedProduct.isEdgeGrinding ? "✅" : "❌"}`
      );
    } else {
      setTechnicalInfo(
        `Trọng lượng: ${selectedProduct.weightPerUnit} kg / Viên ~ ${
          selectedProduct.weightPerBox
        } kg / Thùng
M² / thùng: ${selectedProduct.areaPerBox} m² / thùng
Chống trượt: ${"✅"}
Độ hút nước: ${waterAbsorptionValue}
Chống bám bẩn: ${selectedProduct.isAntiFouling ? "✅" : "❌"}
Dùng lát nền: ${selectedProduct.isFlooring ? "✅" : "❌"}
Dùng ốp tường: ${selectedProduct.isWalling ? "✅" : "❌"}
Sử dụng trong nhà: ${selectedProduct.isInside ? "✅" : "❌"}
Sử dụng ngoài trời: ${selectedProduct.isOutside ? "✅" : "❌"}
Sản phẩm mài cạnh: ${selectedProduct.isEdgeGrinding ? "✅" : "❌"}`
      );
    }
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
      name: "STT",
      selector: (row) => row.id,
      sortable: true,
      maxWidth: "3px",
      wrap: false,
    },
    {
      name: "Ngày đăng",
      selector: (row) =>
        new Date(
          row.createdDate
        ).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      sortable: true,
    },
    {
      name: "Mã hàng",
      selector: (row) => row.confirmAutoBarCode,
      sortable: true,
      cell: (row) => {
        const isUploaded =
          Number(row.uploadWebsiteStatus) === 1 ||
          row.uploadWebsiteStatus === "Uploaded";
        return (
          isUploaded ? (
            <a href={`https://ankhanhhouse.com/san-pham/${row.confirmAutoBarCode}`} target="_blank" rel="noopener noreferrer" >
              <span className="underline">{row.confirmAutoBarCode}</span>
            </a>
          ) : (
            <span>{row.confirmAutoBarCode}</span>
          )
        );
      },
    },
    {
      name: "Mã NCC",
      selector: (row) => row.supplierCode,
    },
    {
      name: "Mã SKU",
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
      selector: (row) => row.creator ?? "Chưa có",
    },
    {
      name: "Sửa",
      selector: (row) => row.modifier ?? "Chưa có",
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
          <Badge size="xs" color={isUploaded ? "success" : "error"}>
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
      <div className="w-full overflow-x-auto rounded-xl overflow-hidden border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-2 md:p-4">
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
          customStyles={{
            table: {
              style: {
                minWidth: '1200px',
              },
            },
          }}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        className="w-full max-w-[1100px] px-20"
      >
        <div className="p-4 max-h-[80vh] overflow-y-scroll">
          <h2 className="text-2xl font-bold my-5 text-center">
            THÔNG TIN WEBSITE GẠCH ỐP LÁT
          </h2>
          {selectedProduct ? (
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                {/* First row - Short Code and Supplier Item Code */}
                <div>
                  <ProductLabel className="text-md mb-1">
                    Mã ngắn - sản phẩm:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.confirmAutoBarCode}
                  />
                </div>
                <div>
                  <ProductLabel className="text-md text-red-500 mb-1">
                    Mã kiểm kho:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full text-red-500"
                    value={storageCheckingCode}
                  />
                </div>

                {/* Second row - Product Code */}
                <div className="col-span-2">
                  <ProductLabel className="text-md mb-1">
                    Mã sản phẩm:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={displayWebsiteName}
                  />
                </div>

                {/* Third row - Unit and Delivery Date */}
                <div>
                  <ProductLabel className="text-md text-red-500 mb-1">
                    ĐVT:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full italic text-red-500"
                    value={
                      "(Giá áp dụng trên mỗi " +
                      selectedProduct.autoCalculatedUnit.toLowerCase() +
                      ")"
                    }
                  />
                </div>
                <div>
                  <ProductLabel className="text-md mb-1">
                    Thời gian giao hàng:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={
                      "Giao hàng nhanh " +
                      selectedProduct.deliveryEstimatedDate +
                      " _ " +
                      storageName
                    }
                  />
                </div>

                {/* Technical Info */}
                <div className="col-span-2">
                  <ProductLabel className="text-md mb-1">
                    Thông tin kỹ thuật:
                  </ProductLabel>
                  <ProductTextArea
                    className="h-[300px] w-full text-lg border-gray-300 bg-gray-100 p-2 overflow-hidden"
                    value={technicalInfo}
                  />
                </div>
              </div>

              <div>
                <ProductLabel className="text-md font-bold mb-1 text-red-500">
                  Hết hạn khuyến mãi ngày:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full font-bold"
                  value={new Date(
                    Date.now() + 1000 * 60 * 60 * 24 * 119
                  ).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  disabled
                />
              </div>

              <div className="grid grid-cols-12 gap-4">
                {/* Price Information */}
                <div className="col-span-4">
                  <ProductLabel className="text-md font-bold mb-1">
                    Giá sản phẩm:
                  </ProductLabel>
                  {selectedProduct.productPrice ? (
                    <NumericFormat
                      value={selectedProduct.productPrice ?? 0}
                      thousandSeparator={isEditing ? false : true}
                      prefix={isEditing ? "" : appCurrency}
                      onFocus={() => setIsEditing(true)}
                      onBlur={() => setIsEditing(false)}
                      allowNegative={false}
                      displayType="input"
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-md shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  ) : (
                    <ProductInputField
                      value={"Chưa có giá"}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-md shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  )}
                </div>
                <div className="col-span-4">
                  <ProductLabel className="text-md font-bold mb-1">
                    Giá khuyến mãi 1:
                  </ProductLabel>
                  {selectedProduct.discountedPrice ? (
                    <NumericFormat
                      value={selectedProduct.discountedPrice ?? 0}
                      thousandSeparator={isEditing ? false : true}
                      prefix={isEditing ? "" : appCurrency}
                      onFocus={() => setIsEditing(true)}
                      onBlur={() => setIsEditing(false)}
                      allowNegative={false}
                      displayType="input"
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-md shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  ) : (
                    <ProductInputField
                      value={"Chưa có giá"}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-md shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  )}
                </div>
                <div className="col-span-4">
                  <ProductLabel className="text-md font-bold mb-1">
                    Giá khuyến mãi 2:
                  </ProductLabel>
                  {selectedProduct.secondDiscountedPrice ? (
                    <NumericFormat
                      value={selectedProduct.secondDiscountedPrice ?? 0}
                      thousandSeparator={isEditing ? false : true}
                      prefix={isEditing ? "" : appCurrency}
                      onFocus={() => setIsEditing(true)}
                      onBlur={() => setIsEditing(false)}
                      allowNegative={false}
                      displayType="input"
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-md shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  ) : (
                    <ProductInputField
                      value={"Chưa có giá"}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-md shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                {/* Quantity and Weight Information */}
                <div className="col-span-4">
                  <ProductLabel className="text-md font-bold mb-1">
                    Viên/thùng:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.quantityPerBox + " Viên / Thùng"}
                  />
                </div>
                <div className="col-span-4">
                  <ProductLabel className="text-md font-bold mb-1">
                    Kg/thùng:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.weightPerBox + " Kg / Thùng"}
                  />
                </div>
                <div className="col-span-4">
                  <ProductLabel className="text-md font-bold mb-1">
                    Kg/Viên:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.weightPerUnit + " Kg / Viên"}
                  />
                </div>
              </div>

              {/* Product Details */}
              <div>
                <ProductLabel className="text-md font-bold mb-1">
                  Bề mặt:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={productSurface}
                />
              </div>
              <div>
                <ProductLabel className="text-md font-bold mb-1">
                  Chất liệu:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={productMaterial}
                />
              </div>
              <div>
                <ProductLabel className="text-md font-bold mb-1">
                  Kích thước:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={productSize}
                />
              </div>
              <div>
                <ProductLabel className="text-md font-bold mb-1">
                  Màu sắc:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={productColor}
                />
              </div>
              <div>
                <ProductLabel className="text-md font-bold mb-1">
                  Số lượng vân:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={selectedProduct.patternQuantity}
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
