import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import ProductTableComponent from "../../../components/tables/product/ProductTableComponent.tsx";
import { useStore } from "../../../app/stores/store.ts";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Modal from "../../../components/ui/modal/index.tsx";
import { runInAction } from "mobx";
import { ProductSupplierDto } from "../../../app/models/product/productSupplier.model.ts";
import { ProductSizeDto } from "../../../app/models/product/productSize.model.ts";
import { useApi } from "../../../hooks/useApi";

function ProductTable() {
  const { productStore, supplierStore, sizeStore, commonStore } = useStore();
  const { isOnline } = useApi();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(productStore.pageSize || 10);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isAdvancedActive, setIsAdvancedActive] = useState(false);
  const [tempSelectedSupplier, setTempSelectedSupplier] = useState<
    number | null
  >(null);
  const [tempSelectedSize, setTempSelectedSize] = useState<number | null>(null);

  const {
    productList,
    loadProducts,
    setTerm,
    term,
    totalCount,
    importProducts,
    loading,
    existingSupplierSizeCombinations, // Lấy danh sách combinations từ store
    loadingCombinations,
  } = productStore;

  const { productSupplierList } = supplierStore;

  const { productSizeList } = sizeStore;

  useEffect(() => {
    if (isOnline) {
      loadProducts();
    }
  }, [pageSize, pageNumber, term, isOnline]);

  useEffect(() => {
    if (!commonStore.token) return;

    const initializeData = async () => {
      if (!isOnline) return;
      
      // Load initial data
      await Promise.all([
        loadProducts(),
        productStore.initialize()
      ]);

      const savedSupplier = localStorage.getItem("selectedSupplier");
      const savedSize = localStorage.getItem("selectedSize");
      const savedPageNumber = localStorage.getItem("pageNumber");
      const savedPageSize = localStorage.getItem("pageSize");
      const initialSupplierId = savedSupplier ? parseInt(savedSupplier) : null;
      const initialSizeId = savedSize ? parseInt(savedSize) : null;

      runInAction(() => {
        productStore.setFilters({
          pageNumber: savedPageNumber ? parseInt(savedPageNumber) : 1,
          pageSize: savedPageSize ? parseInt(savedPageSize) : 10,
          supplierId: initialSupplierId,
          sizeId: initialSizeId,
          term: productStore.term,
        });

        setSelectedSupplier(initialSupplierId);
        setTempSelectedSupplier(initialSupplierId);
        setSelectedSize(initialSizeId);
        setTempSelectedSize(initialSizeId);
        setIsAdvancedActive(initialSupplierId !== null || initialSizeId !== null);
        setPageNumber(savedPageNumber ? parseInt(savedPageNumber) : 1);
        setPageSize(savedPageSize ? parseInt(savedPageSize) : 10);
      });

      // Load products after initialization
      if (!supplierStore.loading && !sizeStore.loading && !productStore.loadingCombinations) {
        productStore.setFilters({
          pageNumber: savedPageNumber ? parseInt(savedPageNumber) : 1,
          pageSize: savedPageSize ? parseInt(savedPageSize) : 10,
          term: productStore.term,
          supplierId: initialSupplierId,
          sizeId: initialSizeId,
        });
      }
    };

    initializeData();
  }, [commonStore.token, isOnline]); // Add isOnline dependency

  // Separate effect for handling filter changes
  useEffect(() => {
    if (!isOnline || supplierStore.loading || sizeStore.loading || productStore.loadingCombinations) return;

    productStore.setFilters({
      pageNumber,
      pageSize,
      term,
      supplierId: isAdvancedActive ? selectedSupplier : null,
      sizeId: isAdvancedActive ? selectedSize : null,
    });

    loadProducts();
  }, [pageNumber, pageSize, term, selectedSupplier, selectedSize, isAdvancedActive, isOnline]);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    productStore.pageSize = newPageSize;
    setPageSize(newPageSize);
    setPageNumber(1); // Reset to first page
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
    setIsAdvancedOpen(true);
  };
  const handleAdvancedClose = () => {
    setIsAdvancedOpen(false);
  };

  const handleResetFilters = () => {
    // Reset state filter local
    setIsAdvancedActive(false);
    setSelectedSupplier(null);
    setSelectedSize(null);
    setTempSelectedSupplier(null);
    setTempSelectedSize(null);
    setPageNumber(1); // Reset state pageNumber local
    setIsAdvancedOpen(false);

    // Xóa/cập nhật localStorage
    localStorage.removeItem("selectedSupplier");
    localStorage.removeItem("selectedSize");
    localStorage.setItem("productPageNumber", "1");
  };

  const handleApplyFilters = () => {
    const hasChanges =
      selectedSupplier !== tempSelectedSupplier ||
      selectedSize !== tempSelectedSize ||
      !isAdvancedActive;

    if (!hasChanges) {
      setIsAdvancedOpen(false);
      return;
    }

    // Cập nhật state filter local
    setSelectedSupplier(tempSelectedSupplier);
    setSelectedSize(tempSelectedSize);
    setIsAdvancedActive(true);

    // Nếu có thay đổi thì reset page (cập nhật state pageNumber local)
    const newPageNumber = 1;
    setPageNumber(newPageNumber);

    // Lưu vào localStorage
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

    setIsAdvancedOpen(false);
  };

  // Hàm helper để kiểm tra nếu một cặp (supplierId, sizeId) tồn tại
  const combinationExists = (supId: number | null, szId: number | null) => {
    if (supId === null || szId === null) return false;
    return existingSupplierSizeCombinations.some(
      (combo) => combo.supplierId === supId && combo.sizeId === szId
    );
  };

  // Hàm helper để xác định class cho nút Supplier
  const getSupplierButtonClass = (supplier: ProductSupplierDto) => {
    const isSelected = tempSelectedSupplier === supplier.id;
    const otherFilterSelected = tempSelectedSize !== null;

    if (isSelected) {
      return "bg-blue-600 text-white"; // Màu đậm khi được chọn
    } else if (otherFilterSelected) {
      // Nếu Size đã được chọn, kiểm tra xem supplier này có combination với size đó không
      const isAvailableCombination = combinationExists(
        supplier.id,
        tempSelectedSize
      );
      return isAvailableCombination
        ? "bg-blue-400 text-white hover:bg-blue-500"
        : "bg-gray-400 text-white hover:bg-gray-500"; // Màu nhạt hoặc xám nếu không có combination
    } else {
      return "bg-blue-400 text-white hover:bg-blue-500"; // Màu mặc định khi chưa chọn filter nào khác
    }
  };

  // Hàm helper để xác định class cho nút Size
  const getSizeButtonClass = (size: ProductSizeDto) => {
    const isSelected = tempSelectedSize === size.id;
    const otherFilterSelected = tempSelectedSupplier !== null;

    if (isSelected) {
      return "bg-green-600 text-white"; // Màu đậm khi được chọn
    } else if (otherFilterSelected) {
      // Nếu Supplier đã được chọn, kiểm tra xem size này có combination với supplier đó không
      const isAvailableCombination = combinationExists(
        tempSelectedSupplier,
        size.id
      );
      return isAvailableCombination
        ? "bg-green-400 text-white hover:bg-green-500"
        : "bg-gray-400 text-white hover:bg-gray-500"; // Màu nhạt hoặc xám nếu không có combination
    } else {
      return "bg-green-400 text-white hover:bg-green-500"; // Màu mặc định khi chưa chọn filter nào khác
    }
  };

  const handleSearch = (searchTerm: string) => {
    setTerm(searchTerm);
  };

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
          additionalButtons={
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx,.xls"
                className="hidden"
              />
              {/* Desktop: Button text */}
              <div className="hidden md:inline-flex gap-2">
                <Button
                  onClick={handleImportClick}
                  className="ml-2 h-8 py-5 font-semibold rounded bg-sky-700 hover:bg-sky-800"
                >
                  Nhập file
                </Button>
                <Button
                  onClick={handleAdvancedOpen}
                  className="ml-2 h-8 py-5 font-semibold rounded bg-sky-700 hover:bg-sky-800"
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
          searchTerm={term ?? ""}
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
          />
        </TableComponentCard>
      </div>
      <Modal
        isOpen={isAdvancedOpen}
        onClose={handleAdvancedClose}
        showCloseButton={false}
        className="p-8 w-full max-w-[800px]"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Supplier Column */}
          <div>
            <h2 className="font-bold mb-2 text-sm md:text-lg">Chọn Nhà Cung Cấp</h2>
            {supplierStore.loading ? ( // Hiển thị loading state
              <p>Đang tải nhà cung cấp...</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                {productSupplierList.map((supplier) => (
                  <button
                    key={supplier.id}
                    className={`px-2 py-2  text-xs min-w-[250px] md:px-4 md:py-2 md:text-base md:min-w-[180px] rounded text-left whitespace-nowrap ${getSupplierButtonClass(supplier)}`}
                    onClick={() => {
                      setTempSelectedSupplier(
                        tempSelectedSupplier === supplier.id ? null : supplier.id
                      );
                    }}
                  >
                    {supplier.supplierCodeName}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Size Column */}
          <div>
            <h2 className="font-bold mb-2 text-sm md:text-lg">Chọn Kích Thước</h2>
            {sizeStore.loading || loadingCombinations ? ( // Hiển thị loading state
              <p>Đang tải kích thước...</p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
                {productSizeList.map((size) => (
                  <button
                    key={size.id}
                    className={`px-2 py-2 text-xs min-w-[90px] md:px-4 md:py-2 md:text-base md:min-w-[111px] rounded whitespace-nowrap w-[90px] md:w-[111px] ${getSizeButtonClass(size)}`}
                    onClick={() => {
                      setTempSelectedSize(
                        tempSelectedSize === size.id ? null : size.id
                      );
                    }}
                  >
                    {size.wide}x{size.length}
                  </button>
                ))}
              </div>
            )}
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
