import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import ProductTableComponent from "../../../components/tables/product/ProductTableComponent.tsx";
import { useStore } from "../../../app/stores/store.ts";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Modal from "../../../components/ui/modal/index.tsx";

function ProductTable() {
  const { productStore, supplierStore, sizeStore } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pageSize, setPageSize] = useState(productStore.pageSize || 10);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isAdvancedActive, setIsAdvancedActive] = useState(false);
  const [tempSelectedSupplier, setTempSelectedSupplier] = useState<number | null>(null);
  const [tempSelectedSize, setTempSelectedSize] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isStoreReady, setIsStoreReady] = useState(false);

  const {
    productList,
    loadProducts,
    loading,
    pageNumber,
    setPageNumber,
    setTerm,
    totalCount,
    term,
    importProducts,
  } = productStore;

  useEffect(() => {
    const savedSupplier = localStorage.getItem("selectedSupplier");
    const savedSize = localStorage.getItem("selectedSize");
  
    const savedPageNumber = localStorage.getItem("productPageNumber");
    const savedPageSize = localStorage.getItem("productPageSize");
  
    if (savedSupplier) {
      const parsedSupplier = parseInt(savedSupplier);
      setSelectedSupplier(parsedSupplier);
      setTempSelectedSupplier(parsedSupplier);
      setIsAdvancedActive(true);
    }
  
    if (savedSize) {
      const parsedSize = parseInt(savedSize);
      setSelectedSize(parsedSize);
      setTempSelectedSize(parsedSize);
      setIsAdvancedActive(true);
    }
  
    if (savedPageNumber) {
      const parsedPageNumber = savedPageNumber ? parseInt(savedPageNumber) : 1;
      productStore.pageNumber = parsedPageNumber;
      setPageNumber(parsedPageNumber);
    }
  
    if (savedPageSize) {
      const parsedPageSize = savedPageSize ? parseInt(savedPageSize) : 10;
      productStore.pageSize = parsedPageSize;
      setPageSize(parsedPageSize);
    }
  
    // Chờ load suppliers và sizes xong rồi mới bật isReady
    Promise.all([
      supplierStore.loadSuppliers(),
      sizeStore.loadSizes()
    ]).then(() => {
      setIsReady(true);
      setIsStoreReady(true); // chỉ đánh dấu true sau khi set xong
    });
  }, []);  

  useEffect(() => {
    if (!isStoreReady || !isReady) return;
  
    // Set filters in the store before loading
    productStore.setFilters({
      pageNumber,
      pageSize,
      term,
      supplierId: isAdvancedActive ? tempSelectedSupplier : null,
      sizeId: isAdvancedActive ? tempSelectedSize : null,
    });
    loadProducts(); // No arguments
  }, [
    pageNumber,
    pageSize,
    term,
    tempSelectedSupplier,
    tempSelectedSize,
    isAdvancedActive,
    isReady,
    isStoreReady,
  ]);  

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    localStorage.setItem("productPageNumber", page.toString());
  };

  const handlePageSizeChange = (newPageSize: number) => {
    productStore.pageSize = newPageSize;
    setPageSize(newPageSize);
    setPageNumber(1); // Reset to first page
    localStorage.setItem("productPageSize", newPageSize.toString());
    localStorage.setItem("productPageNumber", "1");
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
    setIsAdvancedActive(false);
    setSelectedSupplier(null);
    setSelectedSize(null);
    setTempSelectedSupplier(null);
    setTempSelectedSize(null);
    setPageNumber(1);
    setIsAdvancedOpen(false);

    localStorage.removeItem("selectedSupplier");
    localStorage.removeItem("selectedSize");
    localStorage.setItem("productPageNumber", "1");

    // Set filters in the store to reset values
    productStore.setFilters({
      pageNumber: 1,
      pageSize, // Keep current pageSize or reset if desired
      term,     // Keep current term or reset if desired
      supplierId: null,
      sizeId: null,
    });
    loadProducts(); // No arguments
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
  
    setSelectedSupplier(tempSelectedSupplier);
    setSelectedSize(tempSelectedSize);
    setIsAdvancedActive(true);
  
    // Nếu có thay đổi thì reset page
    const newPageNumber = 1;
    setPageNumber(newPageNumber);
    localStorage.setItem("productPageNumber", newPageNumber.toString());
  
    // Save filters
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
  
    // Set filters in the store before loading
    productStore.setFilters({
      pageNumber: newPageNumber,
      pageSize,
      term,
      supplierId: tempSelectedSupplier,
      sizeId: tempSelectedSize,
    });
    loadProducts(); // No arguments
  
    setIsAdvancedOpen(false);
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
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
              {supplierStore.productSupplierList.map((supplier) => (
                <button
                  key={supplier.id}
                  className={`px-4 py-2 rounded text-left whitespace-nowrap ${
                    tempSelectedSupplier === supplier.id
                      ? "bg-blue-600 text-white"
                      : "bg-blue-400 text-white"
                  }`}
                  onClick={() => {
                    setTempSelectedSupplier(
                      tempSelectedSupplier === supplier.id ? null : supplier.id
                    );
                  }}
                  style={{ minWidth: 180 }}
                >
                  {supplier.supplierCodeName}
                </button>
              ))}
            </div>
          </div>
          {/* Size Column */}
          <div>
            <h2 className="font-bold mb-2">Chọn Kích Thước</h2>
            <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
              {sizeStore.productSizeList.map((size) => (
                <button
                  key={size.id}
                  className={`px-4 py-2 rounded whitespace-nowrap ${
                    tempSelectedSize === size.id
                      ? "bg-green-600 text-white"
                      : "bg-green-400 text-white"
                  } w-[111px]`}
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
