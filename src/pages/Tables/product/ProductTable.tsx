import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import ProductTableComponent from "../../../components/tables/product/ProductTableComponent.tsx";
import { useStore } from "../../../app/stores/store.ts";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Modal from "../../../components/ui/modal/index.tsx";
import { useApi } from "../../../hooks/useApi";
import { UploadWebsiteStatus } from "../../../app/models/product/enum/product.enum";

function ProductTable() {
  const { productStore, supplierStore, sizeStore, commonStore } = useStore();
  const { isOnline } = useApi();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pageNumber, setPageNumber] = useState(
    parseInt(localStorage.getItem("pageNumber") ?? "2")
  );
  const [pageSize, setPageSize] = useState(() => {
    const saved = localStorage.getItem("pageSize");
    return saved ? parseInt(saved) : 10;
  });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<UploadWebsiteStatus[]>([]);
  const [tempSelectedSupplier, setTempSelectedSupplier] = useState<number | null>(null);
  const [tempSelectedSize, setTempSelectedSize] = useState<number | null>(null);
  const [tempSelectedStatuses, setTempSelectedStatuses] = useState<UploadWebsiteStatus[]>([]);
  const [isAdvancedActive, setIsAdvancedActive] = useState(false);
  const [selectedIsPriced, setSelectedIsPriced] = useState<boolean | null>(null);
  const [tempSelectedIsPriced, setTempSelectedIsPriced] = useState<boolean | null>(null);
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const [pageNumberInitialized, setPageNumberInitialized] = useState(false);
  // Tạo list uploadWebsiteStatus với thông tin hiển thị
  const uploadWebsiteStatusList = [
    { id: UploadWebsiteStatus.Uploaded, name: "Đã up web", color: "bg-green-400 hover:bg-green-500" },
    { id: UploadWebsiteStatus.Captured, name: "Đã chụp", color: "bg-blue-400 hover:bg-blue-500" },
    { id: UploadWebsiteStatus.Named, name: "Đã đặt tên", color: "bg-purple-400 hover:bg-purple-500" },
    { id: UploadWebsiteStatus.ReAdded, name: "Thêm lại", color: "bg-yellow-400 hover:bg-yellow-500" },
    { id: UploadWebsiteStatus.ReNameSupplier, name: "Đổi tên NCC", color: "bg-orange-400 hover:bg-orange-500" },
    { id: UploadWebsiteStatus.NotCaptured, name: "Chưa chụp", color: "bg-red-400 hover:bg-red-500" },
    { id: UploadWebsiteStatus.Cancel, name: "Hủy", color: "bg-gray-400 hover:bg-gray-500" },
    { id: UploadWebsiteStatus.RecheckSupplierCode, name: "Kiểm tra lại", color: "bg-indigo-400 hover:bg-indigo-500" },
    { id: UploadWebsiteStatus.Dropped, name: "Đã bỏ", color: "bg-pink-400 hover:bg-pink-500" },
    { id: UploadWebsiteStatus.Stopped, name: "Dừng", color: "bg-red-500 hover:bg-red-600" },
    { id: UploadWebsiteStatus.VideoMissing, name: "Thiếu video", color: "bg-amber-400 hover:bg-amber-500" },
  ];

  const {
    productList,
    loadProducts,
    setTerm,
    term,
    totalCount,
    importProducts,
    // updateColor,
    loading,
    existingSupplierSizeCombinations,
  } = productStore;

  const { productSupplierList } = supplierStore;

  const { productSizeList } = sizeStore;

  // Tách state cho input search
  const [searchInput, setSearchInput] = useState(term ?? "");

  useEffect(() => {
    if (!commonStore.token || !isOnline) return;
    const savedPageNumber = localStorage.getItem("pageNumber");
    if (savedPageNumber && parseInt(savedPageNumber) !== pageNumber) {
      setPageNumber(parseInt(savedPageNumber));
      setTimeout(() => setPageNumberInitialized(true), 0);
    } else {
      setPageNumberInitialized(true);
    }
    // Lấy filter từ localStorage
    const savedSupplier = localStorage.getItem("selectedSupplier");
    const savedSize = localStorage.getItem("selectedSize");
    const savedStatuses = localStorage.getItem("selectedStatuses");
    const savedPageSize = localStorage.getItem("pageSize");
    const savedIsPriced = localStorage.getItem("selectedIsPriced");
    const savedTerm = localStorage.getItem("term");
    const initialSupplierId = savedSupplier ? parseInt(savedSupplier) : null;
    const initialSizeId = savedSize ? parseInt(savedSize) : null;
    const initialStatuses = savedStatuses ? JSON.parse(savedStatuses) : [];
    const initialIsPriced = savedIsPriced ? JSON.parse(savedIsPriced) : null;
    setSelectedSupplier(initialSupplierId);
    setTempSelectedSupplier(initialSupplierId);
    setSelectedSize(initialSizeId);
    setTempSelectedSize(initialSizeId);
    setSelectedStatuses(initialStatuses);
    setTempSelectedStatuses(initialStatuses);
    setSelectedIsPriced(initialIsPriced);
    setTempSelectedIsPriced(initialIsPriced);
    setIsAdvancedActive(initialSupplierId !== null || initialSizeId !== null || initialStatuses.length > 0 || initialIsPriced !== null);
    if (savedPageSize && parseInt(savedPageSize) !== pageSize) {
      setPageSize(parseInt(savedPageSize));
    }
    setSearchInput(savedTerm ?? "");
    if (savedTerm !== null && savedTerm !== term) {
      setTerm(savedTerm);
    }
    setFiltersInitialized(true);
  }, [commonStore.token, isOnline]);

  useEffect(() => {
    if (
      !isOnline ||
      supplierStore.loading ||
      sizeStore.loading ||
      !filtersInitialized ||
      !pageSize ||
      !pageNumberInitialized
    )
      return;

    productStore.setFilters({
      pageNumber,
      pageSize,
      term,
      supplierId: isAdvancedActive && selectedSupplier !== null ? selectedSupplier : undefined,
      sizeId: isAdvancedActive && selectedSize !== null ? selectedSize : undefined,
      uploadWebsiteStatuses: isAdvancedActive ? selectedStatuses : [],
      isPriced: isAdvancedActive ? selectedIsPriced : undefined,
    });
    loadProducts();
  }, [
    pageNumber,
    pageSize,
    term,
    selectedSupplier,
    selectedSize,
    selectedStatuses,
    selectedIsPriced,
    isAdvancedActive,
    isOnline,
    supplierStore.loading,
    sizeStore.loading,
    filtersInitialized,
    pageNumberInitialized
  ]);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    localStorage.setItem("pageNumber", page.toString());
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (newPageSize === pageSize) return; // Không làm gì nếu không đổi pageSize
    productStore.pageSize = newPageSize;
    setPageSize(newPageSize);
    setPageNumber(1); // Reset to first page
    localStorage.setItem("pageSize", newPageSize.toString());
    localStorage.setItem("pageNumber", "1"); // Reset page về 1
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await importProducts(file);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Open modal
  const handleAdvancedOpen = () => {
    setTempSelectedSupplier(selectedSupplier);
    setTempSelectedSize(selectedSize);
    setTempSelectedStatuses(selectedStatuses);
    setSelectedIsPriced(selectedIsPriced);
    setTempSelectedIsPriced(selectedIsPriced);
    setIsAdvancedOpen(true);
  };
  const handleAdvancedClose = () => {
    setIsAdvancedOpen(false);
  };

  const handleResetFilters = () => {
    setIsAdvancedActive(false);
    setSelectedSupplier(null);
    setSelectedSize(null);
    setSelectedStatuses([]);
    setSelectedIsPriced(null);
    setTempSelectedIsPriced(null);
    setTempSelectedSupplier(null);
    setTempSelectedSize(null);
    setTempSelectedStatuses([]);
    setTerm("");
    setPageNumber(1);
    setIsAdvancedOpen(false);
    localStorage.removeItem("selectedSupplier");
    localStorage.removeItem("selectedSize");
    localStorage.removeItem("selectedStatuses");
    localStorage.removeItem("selectedIsPriced");
    localStorage.removeItem("term");
    localStorage.setItem("pageNumber", "1"); // Reset page về 1 khi reset filter
  };

  const handleApplyFilters = () => {
    const hasChanges =
      selectedSupplier !== tempSelectedSupplier ||
      selectedSize !== tempSelectedSize ||
      JSON.stringify(selectedStatuses) !== JSON.stringify(tempSelectedStatuses) ||
      selectedIsPriced !== tempSelectedIsPriced ||
      !isAdvancedActive;

    if (!hasChanges) {
      setIsAdvancedOpen(false);
      return;
    }

    setSelectedSupplier(tempSelectedSupplier);
    setSelectedSize(tempSelectedSize);
    setSelectedStatuses(tempSelectedStatuses);
    setSelectedIsPriced(tempSelectedIsPriced);
    setIsAdvancedActive(
      tempSelectedSupplier !== null ||
      tempSelectedSize !== null ||
      tempSelectedStatuses.length > 0 ||
      tempSelectedIsPriced !== null
    );
    const newPageNumber = 1;
    setPageNumber(newPageNumber);
    localStorage.setItem("pageNumber", newPageNumber.toString());
    if (tempSelectedSupplier !== null) {
      localStorage.setItem("selectedSupplier", tempSelectedSupplier.toString());
    } else {
      localStorage.removeItem("selectedSupplier");
    }
    if (tempSelectedSize !== null) {
      localStorage.setItem("selectedSize", tempSelectedSize.toString());
    } else {
      localStorage.removeItem("selectedSize");
    }
    localStorage.setItem("selectedStatuses", JSON.stringify(tempSelectedStatuses));
    localStorage.setItem("selectedIsPriced", tempSelectedIsPriced?.toString() || "");
    setIsAdvancedOpen(false);
  };

  // Hàm helper để kiểm tra nếu một cặp (supplierId, sizeId) tồn tại
  const combinationExists = (supId: number | null, szId: number | null) => {
    if (supId === null || szId === null) return false;
    return existingSupplierSizeCombinations.some(
      (combo) => combo.supplierId === supId && combo.sizeId === szId
    );
  };

  // Sửa lại logic search
  const handleSearch = (value: string) => {
    setSearchInput(value); // chỉ đổi input, không đổi store
  };

  const handleSearchSubmit = () => {
    setTerm(searchInput); // chỉ khi bấm nút mới đổi store (trigger search)
  };

  // const handleUpdateColor = () => {
  //   fileInputRef.current?.click();
  // };

  // const handleUpdateColorFileChange = async (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     await updateColor(file);
  //     // Reset the file input
  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = "";
  //     }
  //   }
  // };

  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là bảng mã hàng của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Mã hàng" />
      <div className="space-y-6">
        <TableComponentCard
          title="Bảng mã hàng"
          addButtonText={"Tạo mã hàng"}
          addButtonLink={"add-product"}
          className="text-white"
          additionalButtons={
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx,.xls"
                className="hidden"
              />
              {/* <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpdateColorFileChange}
                accept=".xlsx,.xls"
                className="hidden"
              /> */}
              {/* Desktop: Button text */}
              <div className="hidden md:inline-flex md:mr-2 py-2">
                <Button
                  onClick={handleImportClick}
                  className="ml-2 h-8 py-5 font-semibold rounded bg-sky-700 hover:bg-sky-800 text-white"
                >
                  Nhập file
                </Button>
                {/* <Button
                  onClick={handleUpdateColor}
                  className="ml-2 h-8 py-5 font-semibold rounded bg-sky-700 hover:bg-sky-800 text-white"
                >
                  Cập nhật màu sắc
                </Button> */}
                <Button
                  onClick={handleAdvancedOpen}
                  className="ml-2 h-8 py-5 font-semibold rounded bg-sky-700 hover:bg-sky-800 text-white"
                >
                  Nâng cao
                </Button>
              </div>
              {/* Mobile: chỉ hiện icon SVG, không dùng Button */}
              <div className="flex md:hidden gap-2">
                <div
                  onClick={handleImportClick}
                  className="bg-sky-700 hover:bg-sky-800 text-white rounded-lg flex items-center justify-center"
                  style={{ width: 35, height: 35, cursor: "pointer" }}
                  aria-label="Nhập file"
                >
                  {/* Upload SVG icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                </div>
                <div
                  onClick={handleAdvancedOpen}
                  className="bg-sky-700 hover:bg-sky-800 text-white rounded-lg flex items-center justify-center"
                  style={{ width: 35, height: 35, cursor: "pointer" }}
                  aria-label="Nâng cao"
                >
                  {/* Filter SVG icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 017 17v-3.586a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z"
                    />
                  </svg>
                </div>
              </div>
            </>
          }
          onSearch={handleSearch}
          onSearchSubmit={handleSearchSubmit}
          searchTerm={searchInput}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
          totalCount={totalCount}
          loading={loading}
          isOnline={isOnline}
        >
          <ProductTableComponent
            data={productList}
            loading={loading}
            currentPage={pageNumber}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            totalCount={totalCount}
            pageSize={pageSize}
          />
        </TableComponentCard>
      </div>
      <Modal
        isOpen={isAdvancedOpen}
        onClose={handleAdvancedClose}
        showCloseButton={false}
        className="p-8 w-full max-w-[1000px]"
      >
        <div className="grid grid-cols-12 gap-4">
          {/* Supplier Column */}
          <div className="col-span-5">
            <h2 className="font-bold mb-2 text-sm md:text-lg">Chọn Nhà Cung Cấp</h2>
            {supplierStore.loading ? (
              <p>Đang tải nhà cung cấp...</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                {productSupplierList.map((supplier) => {
                  const disabled = tempSelectedSize !== null && !combinationExists(supplier.id, tempSelectedSize);
                  return (
                    <button
                      key={supplier.id}
                      disabled={disabled}
                      className={`px-2 py-2 text-xs min-w-[250px] md:px-4 md:py-2 md:text-base md:min-w-[180px] rounded text-left whitespace-nowrap ${disabled ? "bg-gray-400 text-white" : tempSelectedSupplier === supplier.id ? "bg-blue-600 text-white" : "bg-blue-400 text-white hover:bg-blue-500"}`}
                      onClick={() => {
                        if (disabled) return;
                        setTempSelectedSupplier(tempSelectedSupplier === supplier.id ? null : supplier.id);
                      }}
                    >
                      {supplier.supplierCodeName}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {/* Size Column */}
          <div className="col-span-3">
            <h2 className="font-bold mb-2 text-sm md:text-lg">Chọn Kích Thước</h2>
            {sizeStore.loading ? (
              <p>Đang tải kích thước...</p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
                {productSizeList.map((size) => {
                  const disabled = tempSelectedSupplier !== null && !combinationExists(tempSelectedSupplier, size.id);
                  return (
                    <button
                      key={size.id}
                      disabled={disabled}
                      className={`px-2 py-2 text-xs min-w-[90px] md:px-4 md:py-2 md:text-base md:min-w-[111px] rounded whitespace-nowrap w-[90px] md:w-[111px] ${disabled ? "bg-gray-400 text-white" : tempSelectedSize === size.id ? "bg-green-600 text-white" : "bg-green-400 text-white hover:bg-green-500"}`}
                      onClick={() => {
                        if (disabled) return;
                        setTempSelectedSize(tempSelectedSize === size.id ? null : size.id);
                      }}
                    >
                      {size.wide}x{size.length}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {/* Status Column */}
          <div className="col-span-4">
            <h2 className="font-bold mb-2 text-sm md:text-lg">Chọn Trạng Thái</h2>
            <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
              {uploadWebsiteStatusList.map((statusItem) => (
                <button
                  key={statusItem.id}
                  className={`px-2 py-2 text-xs min-w-[90px] md:px-4 md:py-2 md:text-base md:min-w-[111px] rounded whitespace-nowrap w-[90px] md:w-[111px] ${tempSelectedStatuses.includes(statusItem.id) ? "bg-[#334355] text-white font-semibold" : `${statusItem.color} text-white`}`}
                  onClick={() => {
                    setTempSelectedStatuses((prev) =>
                      prev.includes(statusItem.id)
                        ? prev.filter((id) => id !== statusItem.id)
                        : [...prev, statusItem.id]
                    );
                  }}
                >
                  {statusItem.name}
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-4">
            <h2 className="font-bold mb-2 text-sm md:text-lg">Chọn Trạng Thái Giá</h2>
            <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
              <button
                className={`flex items-center justify-center px-2 py-2 text-xs text-center min-w-[100px] md:px-4 md:py-2 md:text-base md:min-w-[111px] rounded whitespace-nowrap w-[100px] md:w-[111px] ${tempSelectedIsPriced === true ? 'bg-blue-600 text-white font-semibold' : 'bg-blue-400 text-white hover:bg-blue-500'}`}
                onClick={() => {
                  setTempSelectedIsPriced(tempSelectedIsPriced === true ? null : true);
                }}
              >
                Đã có giá
              </button>
              <button
                className={`flex items-center justify-center px-2 py-2 text-xs text-center min-w-[100px] md:px-4 md:py-2 md:text-base md:min-w-[111px] rounded whitespace-nowrap w-[100px] md:w-[111px] ${tempSelectedIsPriced === false ? 'bg-blue-600 text-white font-semibold' : 'bg-blue-400 text-white hover:bg-blue-500'}`}
                onClick={() => {
                  setTempSelectedIsPriced(tempSelectedIsPriced === false ? null : false);
                }}
              >
                Chưa có giá
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-start mt-4 gap-2">
          <Button
            onClick={handleApplyFilters}
            className="bg-blue-700 text-white px-4 py-2 rounded"
          >
            Áp dụng
          </Button>
          <Button
            onClick={handleResetFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Xóa bộ lọc
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default observer(ProductTable);
