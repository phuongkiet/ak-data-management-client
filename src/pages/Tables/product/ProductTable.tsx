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

function ProductTable() {
  const { productStore, supplierStore, sizeStore, commonStore } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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

  const { productSupplierList, loadSuppliers } = supplierStore;

  const { productSizeList, loadSizes } = sizeStore;

  useEffect(() => {
    if (!commonStore.token) return;

    const initializeData = async () => {
      // Load initial data
      await Promise.all([
        loadSuppliers(),
        loadSizes(),
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
        loadProducts();
      }
    };

    initializeData();
  }, [commonStore.token]); // Only depend on token

  // Separate effect for handling filter changes
  useEffect(() => {
    if (supplierStore.loading || sizeStore.loading || productStore.loadingCombinations) return;

    productStore.setFilters({
      pageNumber,
      pageSize,
      term,
      supplierId: isAdvancedActive ? selectedSupplier : null,
      sizeId: isAdvancedActive ? selectedSize : null,
    });

    loadProducts();
  }, [pageNumber, pageSize, term, selectedSupplier, selectedSize, isAdvancedActive]);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    productStore.setPageNumber(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    productStore.setPageSize(newPageSize);
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
            </>
          }
          onSearch={(term) => {
            setTerm(term);
            setPageNumber(1);
          }}
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
            <h2 className="font-bold mb-2">Chọn Nhà Cung Cấp</h2>
            {supplierStore.loading ? ( // Hiển thị loading state
              <p>Đang tải nhà cung cấp...</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                {productSupplierList.map((supplier) => (
                  <button
                    key={supplier.id}
                    // Sử dụng hàm helper để xác định class
                    className={`px-4 py-2 rounded text-left whitespace-nowrap ${getSupplierButtonClass(
                      supplier
                    )}`}
                    onClick={() => {
                      setTempSelectedSupplier(
                        tempSelectedSupplier === supplier.id
                          ? null
                          : supplier.id
                      );
                    }}
                    style={{ minWidth: 180 }}
                  >
                    {supplier.supplierCodeName}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Size Column */}
          <div>
            <h2 className="font-bold mb-2">Chọn Kích Thước</h2>
            {sizeStore.loading || loadingCombinations ? ( // Hiển thị loading state
              <p>Đang tải kích thước...</p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
                {productSizeList.map((size) => (
                  <button
                    key={size.id}
                    // Sử dụng hàm helper để xác định class
                    className={`px-4 py-2 rounded whitespace-nowrap ${getSizeButtonClass(
                      size
                    )} w-[111px]`}
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
