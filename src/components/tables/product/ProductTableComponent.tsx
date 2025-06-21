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
import { useTheme } from "../../../app/context/ThemeContext.tsx";
import { ProductSupplierDto } from "../../../app/models/product/productSupplier.model.ts";
import { FaEye } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { TbCircleLetterS } from "react-icons/tb";
import { Tooltip } from "react-tooltip";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSapoModalOpen, setIsSapoModalOpen] = useState(false);
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
  const [supplier, setSupplier] = useState<ProductSupplierDto>();
  const [productSizeSapo, setProductSizeSapo] = useState("");
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
    bodyColorStore,
    supplierStore,
    calculatedUnitStore,
    originStore,
  } = useStore();
  const { theme } = useTheme();
  useEffect(() => {
    if (!selectedProduct) {
      setTechnicalInfo("");
      setStorageCheckingCode("");
      setStorageName("");
      setSupplier(undefined);
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

    const color = colorStore.productColorList.find(c => c.id == selectedProduct?.colorId);
    setProductColor(color?.name ?? "");

    const pattern = patternStore.productPatternList.find(
      (x) => x.id === selectedProduct?.brickPatternId
    );

    const size = sizeStore.productSizeList.find(
      (x) => x.id === selectedProduct?.actualSizeId
    );

    const bodyColor = bodyColorStore.productBodyColorList.find(
      (x) => x.id === selectedProduct?.brickBodyId
    );

    const actualSize = size
      ? `${Number(size.wide) / 10} x ${Number(size.length) / 10} cm`
      : "";

    const displayWebsiteSize =
      actualSize + " x " + selectedProduct.thicknessSize + " | mm";
    setProductSize(displayWebsiteSize);
    setProductSizeSapo(actualSize);

    setDisplayWebsiteName(
      `${selectedProduct.autoBarCode} - ${actualSize} - ${pattern?.name} ${color?.name} ${surface?.name} ${material?.name} ${bodyColor?.name}`.trim()
    );

    setStorageCheckingCode(
      selectedProduct.confirmAutoBarCode.replace(/\./g, "")
    );

    const supplier = supplierStore.productSupplierList.find(
      (x) => x.id === selectedProduct?.supplierId
    );
    setSupplier(supplier);

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

  const handleViewUploadSapo = async (id: number) => {
    try {
      await productStore.loadProductDetail(id);
      setSelectedProduct(productStore.productDetail);
      setIsSapoModalOpen(true);
    } catch (error) {
      console.error("Error loading product:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSapoModalOpen(false);
    setSelectedProduct(null);
  };

  const columns: TableColumn<ProductDto>[] = [
    {
      name: "STT",
      selector: (row) => row.id,
      sortable: true,
      maxWidth: "80px",
      cell: (row) => {
        return (
          <button className="text-blue-600 dark:text-white hover:underline" onClick={() => handleView(row)}>
            {row.id}
          </button>
        );
      }
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
      minWidth: "150px",
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
      minWidth: "150px",
      cell: (row) => {
        return (
          <div className="" data-tooltip-id="view-tooltip" data-tooltip-content={row.supplierCode}>
            {row.supplierCode.slice(0, 10)}...
            <Tooltip id="view-tooltip" className="text-md" />
          </div>
        );
      }
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
      name: "Giá KM",
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewUploadWebsite(row.id)}
            className="dark:text-blue-600 text-[#334355] hover:underline font-medium"
            data-tooltip-id="view-tooltip"
            data-tooltip-content="Website"
          >
            <CgWebsite className="w-6 h-6 hover:opacity-50" />
            <Tooltip id="view-tooltip" className="text-md" />
          </button>
          <button
            onClick={() => handleViewUploadSapo(row.id)}
            className="dark:text-blue-600 text-emerald-500 hover:underline font-medium"
            data-tooltip-id="view-tooltip"
            data-tooltip-content="Sapo"
          >
            <TbCircleLetterS className="w-6 h-6 hover:opacity-50" />
            <Tooltip id="view-tooltip" className="text-md" />
          </button>
          <button
            onClick={() => handleView(row)}
            className="dark:text-blue-600 text-fuchsia-600 hover:underline font-medium"
            data-tooltip-id="view-tooltip"
            data-tooltip-content="Chi tiết"
          >
            <FaEye className="w-6 h-6 hover:opacity-50" />
            <Tooltip id="view-tooltip" className="text-md" />
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
          theme={theme === 'dark' ? 'customDark' : 'default'}
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
                minWidth: "1200px",
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
          <h2 className="text-2xl font-bold my-5 text-center text-black dark:text-white">
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

      <Modal
        isOpen={isSapoModalOpen}
        onClose={() => setIsSapoModalOpen(false)}
        className="w-full max-w-[1100px] px-20"
      >
        <div className="p-4 max-h-[80vh] overflow-y-scroll">
          <h2 className="text-2xl font-bold my-5 text-center text-black dark:text-white">
            THÔNG TIN SAPO GẠCH ỐP LÁT
          </h2>
          {selectedProduct ? (
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Row 1: Tên phiên bản sản phẩm */}
                <div className="col-span-2">
                  <ProductLabel className="text-md mb-1">
                    Tên phiên bản sản phẩm:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={displayWebsiteName}
                  />
                </div>

                {/* Row 2: Mã sản phẩm và Mã vạch */}
                <div>
                  <ProductLabel className="text-md mb-1">
                    Mã sản phẩm / SKU:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.confirmSupplierItemCode}
                  />
                </div>
                <div>
                  <ProductLabel className="text-md mb-1">
                    Mã vạch / Barcode:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.autoBarCode}
                  />
                </div>

                {/* Row 3: Khối lượng và Đơn vị tính */}
                <div>
                  <ProductLabel className="text-md mb-1">
                    Khối lượng:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.weightPerBox + " Kg / Thùng"}
                  />
                </div>
                <div>
                  <ProductLabel className="text-md mb-1">
                    Đơn vị tính:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full italic text-red-500"
                    value={calculatedUnitStore.productCalculatedUnitList.find(
                      (x) => x.id === selectedProduct?.calculatedUnitId
                    )?.calculatedUnitName ?? "Chưa xác định"}
                  />
                </div>

                {/* Row 4: Nhãn hiệu và Tag */}
                <div>
                  <ProductLabel className="text-md mb-1">
                    Nhãn hiệu:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={
                      supplier?.supplierShortCode ?? "Chưa xác định"
                    }
                  />
                </div>
                <div>
                  <ProductLabel className="text-md mb-1">
                    Tag:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={supplier?.supplierCodeName ?? "Chưa xác định"}
                  />
                </div>

                {/* Row 5: Giá bán lẻ vnd/m2 và Mô tả sản phẩm */}
                <div>
                  <ProductLabel className="text-md mb-1">
                    Giá bán lẻ (VND/m2):
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.productPrice ? `${selectedProduct.productPrice.toLocaleString()} VND/m2` : "Chưa có giá"}
                  />
                </div>
                <div>
                  <ProductLabel className="text-md mb-1">
                    Mô tả sản phẩm:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={productSizeSapo +" ( " + selectedProduct.quantityPerBox + "Viên/" + selectedProduct.areaPerBox + "m2/thùng)" }
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                {/* Quantity and Weight Information */}
                <div className="col-span-6">
                  <ProductLabel className="text-md font-bold mb-1">
                    Xuất xứ:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={originStore.productOriginList.find(
                      (x) => x.id === selectedProduct?.originCountryId
                    )?.upperName ?? "Chưa xác định"}
                  />
                </div>
                <div className="col-span-6">
                  <ProductLabel className="text-md font-bold mb-1">
                    Chất liệu:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={productMaterial}
                  />
                </div>
              </div>

              <div>
                <ProductLabel className="text-md font-bold mb-1 text-red-500">
                  Ngày nhập liệu:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full font-bold dark:text-white "
                  value={new Date(
                    Date.now()
                  ).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  disabled
                />
              </div>

              <div className="grid grid-cols-12 gap-4">
                {/* Quantity and Weight Information */}
                <div className="col-span-6">
                  <ProductLabel className="text-md font-bold mb-1">
                    Hệ vân & nhóm chủng loại:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={patternStore.productPatternList.find(
                      (x) => x.id === selectedProduct?.brickPatternId
                    )?.name ?? "Chưa xác định"}
                  />
                </div>
                <div className="col-span-6">
                  <ProductLabel className="text-md font-bold mb-1">
                    Số viên / thùng:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.quantityPerBox + " Viên/Thùng"}
                  />
                </div>
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

              {/* Product Details */}
              <div>
                <ProductLabel className="text-md font-bold mb-1">
                  Số lượng vân:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={selectedProduct.patternQuantity}
                />
              </div>
              <div>
                <ProductLabel className="text-md font-bold mb-1">
                  Thời gian giao hàng:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={selectedProduct.deliveryEstimatedDate}
                />
              </div>
              <div>
                <ProductLabel className="text-md font-bold mb-1">
                  Tình trạng:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={storageName}
                />
              </div>
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
                  Kích thước danh nghĩa:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={productSize}
                />
              </div>
              <div>
                <ProductLabel className="text-md font-bold mb-1">
                  Kích thước:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={productSizeSapo}
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
