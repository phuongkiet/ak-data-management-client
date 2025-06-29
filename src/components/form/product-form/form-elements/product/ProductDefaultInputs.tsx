import ComponentCard from "../../../../common/ComponentCard.tsx";
import ProductLabel from "../../ProductLabel.tsx";
import Input from "../../input/product/ProductInputField.tsx";
import ProductTextArea from "../../input/product/ProductTextArea.tsx";
import { useStore } from "../../../../../app/stores/store.ts";
import CompanyCodeGroup from "../../company-code/CompanyCode.tsx";
import { observer } from "mobx-react-lite";
import ProcessingGroup from "../../processing/Processing.tsx";
import StorageGroup from "../../storage/Storage.tsx";
import CalculatedUnit from "../../calculated-unit/CalculatedUnit.tsx";
import { ProductDetail } from "../../../../../app/models/product/product.model.ts";
import { appCurrency } from "../../../../../app/common/common.ts";
import { NumericFormat } from "react-number-format";
import { useState, useEffect, useCallback } from "react";
import FactoryGroup from "../../product-factory/Factory.tsx";
import { useNetworkStatus } from "../../../../../hooks/useNetworkStatus";
import { debounce } from "lodash";
import Button from "../../../../ui/button/Button.tsx";
import ProcessingPriceModal from "./ProcessingPriceModal";

interface ProductProps {
  product?: ProductDetail;
  isCreateMode: boolean;
  onChange?: (field: string, value: any) => void;
}

const ProductDefaultInputs = ({
  product,
  isCreateMode,
  onChange,
}: ProductProps) => {
  const isOnline = useNetworkStatus();
  const {
    productStore,
    companyCodeStore,
    sizeStore,
    supplierStore,
    patternStore,
    colorStore,
    bodyColorStore,
    materialStore,
    surfaceStore,
  } = useStore();

  const { productSizeList } = sizeStore;
  const { productSupplierList } = supplierStore;
  const { productCompanyCodeList } = companyCodeStore;
  const { productPatternList } = patternStore;
  const { productColorList } = colorStore;
  const { productBodyColorList } = bodyColorStore;
  const { productMaterialList } = materialStore;
  const { productSurfaceList } = surfaceStore;
  const { getNextOrderNumberAuto } = productStore;

  const [confirmSupplierItemCode, setConfirmSupplierItemCode] = useState<
    string | undefined
  >("");
  const [supplierItemCode, setSupplierItemCode] = useState<string>("");
  const [isValidSupplierCode, setIsValidSupplierCode] = useState<
    boolean | null
  >(null);
  const [websiteProductName, setWebsiteProductName] = useState<string>("");
  const [otherNote, setOtherNote] = useState<string>(product?.otherNote || "");
  const [deliveryEstimatedDate, setDeliveryEstimatedDate] = useState<string>(
    product?.deliveryEstimatedDate || "1-2 ngày"
  );
  const [manualOrderNumber, setManualOrderNumber] = useState<string>(
    productStore.productForm.productOrderNumber?.toString() || ""
  );
  const [isChecking, setIsChecking] = useState(false);
  const [isProcessingPriceModalOpen, setIsProcessingPriceModalOpen] =
    useState(false);

  // Add effect to update manualOrderNumber when productOrderNumber changes from store
  useEffect(() => {
    productStore.updateProductForm("deliveryEstimatedDate", "1-2 ngày");
  }, []);

  useEffect(() => {
    if (isOnline && productStore.productForm.productOrderNumber) {
      setManualOrderNumber(
        productStore.productForm.productOrderNumber.toString()
      );
    }
  }, [productStore.productForm.productOrderNumber, isOnline]);

  // Add effect to update product code when supplier changes
  useEffect(() => {
    if (productStore.productForm.supplierId) {
      handleProductCodeChange();
    }
  }, [productStore.productForm.supplierId]);

  const handleConfirmAutoBarCodeChange = () => {
    if (
      productStore.productForm.supplierId &&
      (productStore.productForm.productOrderNumber || manualOrderNumber)
    ) {
      const supplier = productSupplierList.find(
        (x) => x.id === productStore.productForm.supplierId
      );
      const pattern = productPatternList.find(
        (x) => x.id === productStore.productForm.brickPatternId
      );

      if (supplier?.supplierShortCode) {
        const patternCode = pattern?.shortCode || "";
        const orderNumber = isOnline
          ? productStore.productForm.productOrderNumber
          : manualOrderNumber;
        const newBarCode = `${supplier.supplierShortCode}.${orderNumber}${patternCode}`;
        productStore.updateProductForm("autoBarCode", newBarCode);
      }
    }
  };

  // Add effect to update barcode when required fields change
  useEffect(() => {
    handleConfirmAutoBarCodeChange();
  }, [
    productStore.productForm.supplierId,
    productStore.productForm.productOrderNumber,
    manualOrderNumber,
    productStore.productForm.productProcessingId,
    productStore.productForm.brickPatternId,
  ]);

  const handleProductCodeChange = () => {
    if (
      productStore.productForm.supplierId &&
      (productStore.productForm.productOrderNumber || manualOrderNumber)
    ) {
      const supplier = productSupplierList.find(
        (x) => x.id === productStore.productForm.supplierId
      );
      if (supplier?.supplierShortCode) {
        const orderNumber = isOnline
          ? productStore.productForm.productOrderNumber
          : manualOrderNumber;
        const newProductCode = `${supplier.supplierShortCode}.${orderNumber}`;
        productStore.updateProductForm("productCode", newProductCode);
      }
    }
  };

  // Add effect to update product code when supplier or order number changes
  useEffect(() => {
    handleProductCodeChange();
  }, [
    productStore.productForm.supplierId,
    productStore.productForm.productOrderNumber,
    manualOrderNumber,
  ]);

  const handleManualOrderNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setManualOrderNumber(value);
    const numericValue = parseInt(value) || 0;
    productStore.updateProductForm("productOrderNumber", numericValue);
    handleProductCodeChange();
    handleConfirmAutoBarCodeChange();
  };

  const handleConfirmProductCodeChange = () => {
    if (productStore.productForm.companyCodeId && supplierItemCode) {
      const companyCode = productCompanyCodeList.find(
        (x) => x.id === productStore.productForm.companyCodeId
      );

      const lastSixChars = supplierItemCode.slice(-6);

      if (companyCode?.codeName) {
        const newSkuCode = `${companyCode.codeName} ${lastSixChars}`;
        setConfirmSupplierItemCode(newSkuCode);
        productStore.updateProductForm("confirmSupplierItemCode", newSkuCode);
      }
    }
  };

  // Add effect to update SKU when supplierItemCode changes
  useEffect(() => {
    handleConfirmProductCodeChange();
  }, [supplierItemCode, productStore.productForm.companyCodeId]);

  const handleWebsiteProductNameChange = () => {
    if (
      productStore.productForm.autoBarCode &&
      productStore.productForm.supplierId &&
      productStore.productForm.brickPatternId &&
      productStore.productForm.actualSizeId &&
      productStore.productForm.colorId &&
      productStore.productForm.brickBodyId &&
      productStore.productForm.materialId &&
      productStore.productForm.surfaceFeatureId
    ) {
      const pattern = productPatternList.find(
        (x) => x.id === productStore.productForm.brickPatternId
      );

      const size = productSizeList.find(
        (x) => x.id === productStore.productForm.actualSizeId
      );

      const actualSize = size
        ? `${Number(size.wide) / 10} x ${Number(size.length) / 10} cm`
        : "";

      const color = productColorList.find(
        (x) => x.id === productStore.productForm.colorId
      );

      const bodyColor = productBodyColorList.find(
        (x) => x.id === productStore.productForm.brickBodyId
      );

      const material = productMaterialList.find(
        (x) => x.id === productStore.productForm.materialId
      );

      const surfaceFeature = productSurfaceList.find(
        (x) => x.id === productStore.productForm.surfaceFeatureId
      );

      if (pattern?.name) {
        const newWebsiteProductName =
          `${productStore.productForm.autoBarCode} - ${actualSize} - ${pattern.name} ${pattern.description} ${color?.name} ${surfaceFeature?.name} ${material?.name} ${bodyColor?.name}`.trim();
        setWebsiteProductName(newWebsiteProductName);
        productStore.updateProductForm(
          "displayWebsiteName",
          newWebsiteProductName
        );
      }
    }
  };

  useEffect(() => {
    handleWebsiteProductNameChange();
  }, [
    productStore.productForm.autoBarCode,
    productStore.productForm.brickPatternId,
    productStore.productForm.actualSizeId,
    productStore.productForm.colorId,
    productStore.productForm.brickBodyId,
    productStore.productForm.materialId,
    productStore.productForm.surfaceFeatureId,
  ]);

  const handleOtherNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOtherNote(e.target.value);
    productStore.updateProductForm("otherNote", e.target.value);
  };

  const handleDeliveryEstimatedDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setDeliveryEstimatedDate(value);
    if (isCreateMode) {
      productStore.updateProductForm("deliveryEstimatedDate", value);
    } else {
      onChange && onChange("deliveryEstimatedDate", value);
    }
  };

  const updateConfirmSupplierItemCode = (
    supplierItemCodeValue: string,
    companyCodeIdValue: number | undefined
  ) => {
    const companyCode = productCompanyCodeList.find(
      (x) => x.id === companyCodeIdValue
    );

    const lastSixChars = supplierItemCodeValue.slice(-6);
    const newConfirmSupplierItemCode = companyCode?.codeName
      ? `${companyCode.codeName} ${lastSixChars}`
      : lastSixChars;
    onChange && onChange("supplierItemCode", supplierItemCodeValue);
    onChange && onChange("confirmSupplierItemCode", newConfirmSupplierItemCode);
  };

  // Debounced check function
  const debouncedCheck = useCallback(
    debounce(async (value: string) => {
      if (!value) {
        setIsValidSupplierCode(null);
        return;
      }
      setIsChecking(true);
      try {
        const isValid = await productStore.checkSupplierItemCode(value);
        setIsValidSupplierCode(!isValid);
      } catch (error) {
        console.error("Error checking supplier code:", error);
        setIsValidSupplierCode(false);
      } finally {
        setIsChecking(false);
      }
    }, 500),
    []
  );

  const handleSupplierItemCodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value;
    setSupplierItemCode(newValue);
    if (isCreateMode) {
      productStore.updateProductForm("supplierItemCode", newValue);
      debouncedCheck(newValue);
    } else {
      updateConfirmSupplierItemCode(newValue, product?.companyCodeId);
    }
  };

  useEffect(() => {
    if (
      !isCreateMode &&
      product?.supplierItemCode !== undefined &&
      product?.companyCodeId !== undefined
    ) {
      updateConfirmSupplierItemCode(
        product.supplierItemCode,
        product.companyCodeId
      );
    }
  }, [product?.supplierItemCode, product?.companyCodeId, isCreateMode]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedCheck.cancel();
    };
  }, [debouncedCheck]);

  const editModeSku = (() => {
    if (!isCreateMode && product?.companyCodeId && product?.supplierItemCode) {
      const companyCode = productCompanyCodeList.find(
        (x) => x.id === product.companyCodeId
      );
      const lastSixChars = product.supplierItemCode.slice(-6);

      return companyCode?.codeName
        ? `${companyCode.codeName} ${lastSixChars}`
        : lastSixChars;
    }
    return "";
  })();

  const handleEditQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value);
    // Use product?.areaPerUnit, fallback to 0 if not available
    const areaPerUnit = product?.areaPerUnit ?? 0;
    const newAreaPerBox = Number((areaPerUnit * newQuantity).toFixed(2));
    const newWeightPerBox = Number((product?.weightPerUnit ?? 0) * newQuantity);
    if (onChange) {
      onChange("quantityPerBox", newQuantity);
      onChange("areaPerBox", newAreaPerBox);
      onChange("weightPerBox", newWeightPerBox);
    }
  };

  const handleEditWeightPerUnitChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newWeightPerUnit = Number(e.target.value);
    const newWeightPerBox = Number(
      (newWeightPerUnit * (product?.quantityPerBox ?? 0)).toFixed(2)
    );
    if (onChange) {
      onChange("weightPerUnit", newWeightPerUnit);
      onChange("weightPerBox", newWeightPerBox);
    }
  };

  useEffect(() => {
    if (!isCreateMode && product?.supplierId) {
      // Khi supplierId thay đổi ở chế độ update
      const fetchAndUpdate = async () => {
        await getNextOrderNumberAuto();
        // Lấy lại productOrderNumber mới nhất từ store
        const newOrderNumber = productStore.productForm.productOrderNumber;
        if (onChange) {
          onChange("productOrderNumber", newOrderNumber);
        }
        
        // Cập nhật productCode và autoBarCode
        if (product?.supplierId && newOrderNumber) {
          const supplier = productSupplierList.find(
            (x) => x.id === product.supplierId
          );
          const pattern = productPatternList.find(
            (x) => x.id === product.brickPatternId
          );

          if (supplier?.supplierShortCode) {
            // Cập nhật productCode
            const newProductCode = `${supplier.supplierShortCode}.${newOrderNumber}`;
            if (onChange) {
              onChange("productCode", newProductCode);
            }

            // Cập nhật autoBarCode
            const patternCode = pattern?.shortCode || "";
            const newBarCode = `${supplier.supplierShortCode}.${newOrderNumber}${patternCode}`;
            if (onChange) {
              onChange("autoBarCode", newBarCode);
            }
          }
        }
        
        // Cập nhật lại displayWebsiteName cho chế độ update
        if (
          productStore.productForm.autoBarCode &&
          product?.supplierId &&
          product?.brickPatternId &&
          product?.actualSizeId &&
          product?.colorId &&
          product?.brickBodyId &&
          product?.materialId &&
          product?.surfaceFeatureId
        ) {
          const pattern = productPatternList.find(
            (x) => x.id === product.brickPatternId
          );

          const size = productSizeList.find(
            (x) => x.id === product.actualSizeId
          );

          const actualSize = size
            ? `${Number(size.wide) / 10} x ${Number(size.length) / 10} cm`
            : "";

          const color = productColorList.find(
            (x) => x.id === product.colorId
          );

          const bodyColor = productBodyColorList.find(
            (x) => x.id === product.brickBodyId
          );

          const material = productMaterialList.find(
            (x) => x.id === product.materialId
          );

          const surfaceFeature = productSurfaceList.find(
            (x) => x.id === product.surfaceFeatureId
          );

          if (pattern?.name) {
            const newWebsiteProductName =
              `${productStore.productForm.autoBarCode} - ${actualSize} - ${pattern.name} ${pattern.description} ${color?.name} ${surfaceFeature?.name} ${material?.name} ${bodyColor?.name}`.trim();
            
            if (onChange) {
              onChange("displayWebsiteName", newWebsiteProductName);
            }
          }
        }
      };
      fetchAndUpdate();
    }
  }, [product?.supplierId]);

  // Thêm useEffect để theo dõi thay đổi của các trường khác ở chế độ update
  useEffect(() => {
    if (!isCreateMode && onChange) {
      // Cập nhật displayWebsiteName khi các trường thay đổi
      if (
        product?.autoBarCode &&
        product?.supplierId &&
        product?.brickPatternId &&
        product?.actualSizeId &&
        product?.colorId &&
        product?.brickBodyId &&
        product?.materialId &&
        product?.surfaceFeatureId
      ) {
        const pattern = productPatternList.find(
          (x) => x.id === product.brickPatternId
        );

        const size = productSizeList.find(
          (x) => x.id === product.actualSizeId
        );

        const actualSize = size
          ? `${Number(size.wide) / 10} x ${Number(size.length) / 10} cm`
          : "";

        const color = productColorList.find(
          (x) => x.id === product.colorId
        );

        const bodyColor = productBodyColorList.find(
          (x) => x.id === product.brickBodyId
        );

        const material = productMaterialList.find(
          (x) => x.id === product.materialId
        );

        const surfaceFeature = productSurfaceList.find(
          (x) => x.id === product.surfaceFeatureId
        );

        if (pattern?.name) {
          const newWebsiteProductName =
            `${product.autoBarCode} - ${actualSize} - ${pattern.name} ${pattern.description} ${color?.name} ${surfaceFeature?.name} ${material?.name} ${bodyColor?.name}`.trim();
          
          onChange("displayWebsiteName", newWebsiteProductName);
        }
      }
    }
  }, [
    product?.brickPatternId,
    product?.actualSizeId,
    product?.colorId,
    product?.brickBodyId,
    product?.materialId,
    product?.surfaceFeatureId,
    product?.autoBarCode,
    isCreateMode
  ]);

  return (
    <ComponentCard title="Thông tin mã hàng">
      {isCreateMode ? (
        <>
          {/* Desktop View */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Cột trái */}
              <div className="space-y-0">
                <ProductLabel htmlFor="input">Mã An Khánh</ProductLabel>
                <CompanyCodeGroup
                  product={product}
                  isCreateMode={isCreateMode}
                />
              </div>

              <div>
                <ProductLabel htmlFor="input">Mã SKU</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  disabled
                  placeholder="Ô tự động điền"
                  value={confirmSupplierItemCode}
                  onChange={handleConfirmProductCodeChange}
                />
              </div>

              <div>
                <ProductLabel htmlFor="input">Mã barcode sản phẩm</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  disabled
                  placeholder="Ô tự động điền"
                  value={productStore.productForm.autoBarCode}
                  className="text-red-500"
                />
              </div>

              <div>
                <ProductLabel htmlFor="input">Đơn vị tính</ProductLabel>
                <CalculatedUnit product={product} isCreateMode={isCreateMode} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ProductLabel htmlFor="input">Giao hàng tại</ProductLabel>
                  <StorageGroup product={product} isCreateMode={isCreateMode} />
                </div>
                <div>
                  <ProductLabel htmlFor="input">Số ngày giao hàng</ProductLabel>
                  <Input
                    type="text"
                    id="input"
                    placeholder="Số ngày giao hàng"
                    value={deliveryEstimatedDate}
                    onChange={handleDeliveryEstimatedDateChange}
                  />
                </div>
              </div>
            </div>

            {/* Cột phải */}
            <div className="space-y-6">
              <div>
                <ProductLabel htmlFor="input">Mã số nhà cung cấp</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  value={supplierItemCode}
                  placeholder="Mã số sản phẩm của nhà cung cấp"
                  onChange={handleSupplierItemCodeChange}
                  className={`${
                    isValidSupplierCode === null
                      ? ""
                      : isValidSupplierCode
                      ? "text-blue-500"
                      : "text-red-500"
                  } ${isChecking ? "opacity-50" : ""}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ProductLabel htmlFor="input">Số thứ tự</ProductLabel>
                  {isOnline && productStore.productForm.productOrderNumber ? (
                    <Input
                      type="number"
                      id="input"
                      placeholder="Số thứ tự tự động"
                      disabled
                      value={productStore.productForm.productOrderNumber || ""}
                    />
                  ) : (
                    <Input
                      type="text"
                      id="input"
                      placeholder="Nhập số thứ tự"
                      value={manualOrderNumber}
                      onChange={handleManualOrderNumberChange}
                    />
                  )}
                </div>
                <div>
                  <ProductLabel htmlFor="input">Mã sản phẩm</ProductLabel>
                  <Input
                    type="text"
                    id="input"
                    placeholder="Mã sản phẩm"
                    disabled
                    value={productStore.productForm.productCode || ""}
                  />
                </div>
              </div>

              <div>
                <ProductLabel htmlFor="input">
                  Tên hiển thị website
                </ProductLabel>
                <Input
                  type="text"
                  id="input"
                  placeholder="Ô tự động điền"
                  className="text-red-500"
                  value={
                    product?.displayWebsiteName || websiteProductName || ""
                  }
                  onChange={handleWebsiteProductNameChange}
                />
              </div>

              <div>
                <ProductLabel htmlFor="input">Đơn vị tính tự động</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  disabled
                  placeholder="Ô tự động điền"
                  className="text-red-500"
                  value={productStore.productForm.autoCalculatedUnit || ""}
                />
              </div>

              <div>
                <ProductLabel htmlFor="factory">Nhà máy</ProductLabel>
                <FactoryGroup product={product} isCreateMode={isCreateMode} />
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-6">
            <div className="space-y-0">
              <ProductLabel htmlFor="input">Mã An Khánh</ProductLabel>
              <CompanyCodeGroup product={product} isCreateMode={isCreateMode} />
            </div>

            <div>
              <ProductLabel htmlFor="input">Mã số nhà cung cấp</ProductLabel>
              <Input
                type="text"
                id="input"
                value={supplierItemCode}
                placeholder="Mã số sản phẩm của nhà cung cấp"
                onChange={handleSupplierItemCodeChange}
                className={`${
                  isValidSupplierCode === null
                    ? ""
                    : isValidSupplierCode
                    ? "text-blue-500"
                    : "text-red-500"
                } ${isChecking ? "opacity-50" : ""}`}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Số thứ tự</ProductLabel>
              {isOnline && productStore.productForm.productOrderNumber ? (
                <Input
                  type="number"
                  id="input"
                  placeholder="Số thứ tự tự động"
                  disabled
                  value={productStore.productForm.productOrderNumber || ""}
                />
              ) : (
                <Input
                  type="text"
                  id="input"
                  placeholder="Nhập số thứ tự"
                  value={manualOrderNumber}
                  onChange={handleManualOrderNumberChange}
                />
              )}
            </div>

            <div>
              <ProductLabel htmlFor="input">Mã sản phẩm</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Mã sản phẩm"
                disabled
                value={productStore.productForm.productCode || ""}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Mã SKU</ProductLabel>
              <Input
                type="text"
                id="input"
                disabled
                placeholder="Ô tự động điền"
                value={confirmSupplierItemCode}
                onChange={handleConfirmProductCodeChange}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Mã barcode sản phẩm</ProductLabel>
              <Input
                type="text"
                id="input"
                disabled
                placeholder="Ô tự động điền"
                value={productStore.productForm.autoBarCode}
                className="text-red-500"
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Tên hiển thị website</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Ô tự động điền"
                className="text-red-500"
                value={product?.displayWebsiteName || websiteProductName || ""}
                onChange={handleWebsiteProductNameChange}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Đơn vị tính</ProductLabel>
              <CalculatedUnit product={product} isCreateMode={isCreateMode} />
            </div>

            <div>
              <ProductLabel htmlFor="input">Đơn vị tính tự động</ProductLabel>
              <Input
                type="text"
                id="input"
                disabled
                placeholder="Ô tự động điền"
                className="text-red-500"
                value={productStore.productForm.autoCalculatedUnit || ""}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Giao hàng tại</ProductLabel>
              <StorageGroup product={product} isCreateMode={isCreateMode} />
            </div>

            <div>
              <ProductLabel htmlFor="input">Số ngày giao hàng</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Số ngày giao hàng"
                value={deliveryEstimatedDate}
                onChange={handleDeliveryEstimatedDateChange}
              />
            </div>

            <div>
              <ProductLabel htmlFor="factory">Nhà máy</ProductLabel>
              <FactoryGroup product={product} isCreateMode={isCreateMode} />
            </div>
          </div>

          <div className="grid grid-col-1 gap-6">
            <div>
              <ProductLabel>Gia công khác</ProductLabel>
              <ProcessingGroup product={product} isCreateMode={isCreateMode} />
            </div>
          </div>

          <div className="space-y-6 mt-6">
            <div>
              <ProductLabel htmlFor="input">Ghi chú thêm</ProductLabel>
              <ProductTextArea
                placeholder="Ghi chú thêm"
                value={otherNote}
                onChange={handleOtherNoteChange}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Cột trái */}
              <div className="space-y-0">
                <ProductLabel htmlFor="input">Mã An Khánh</ProductLabel>
                <CompanyCodeGroup
                  product={product}
                  isCreateMode={isCreateMode}
                  onChange={onChange}
                />
              </div>

              <div>
                <ProductLabel htmlFor="input">Mã SKU</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  disabled
                  placeholder="Ô tự động điền"
                  value={editModeSku}
                />
              </div>

              <div>
                <ProductLabel htmlFor="input">Mã barcode sản phẩm</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  disabled
                  placeholder="Ô tự động điền"
                  value={product?.autoBarCode}
                  className="text-red-500"
                />
              </div>

              <div>
                <ProductLabel htmlFor="input">
                  Giá sản phẩm website
                </ProductLabel>
                <NumericFormat
                  value={product?.productPrice}
                  thousandSeparator
                  prefix={appCurrency}
                  allowNegative={false}
                  displayType="input"
                  onValueChange={(values) => {
                    const { floatValue } = values;
                    onChange && onChange("productPrice", floatValue ?? 0);
                  }}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <ProductLabel htmlFor="input">Đơn vị tính</ProductLabel>
                <CalculatedUnit
                  product={product}
                  isCreateMode={isCreateMode}
                  onChange={onChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ProductLabel htmlFor="input">
                    Khối lượng KG/Viên
                  </ProductLabel>
                  <Input
                    type="number"
                    id="input"
                    placeholder="Ô tự động điền"
                    onChange={handleEditWeightPerUnitChange}
                    value={product?.weightPerUnit}
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="input">Số lượng</ProductLabel>
                  <Input
                    type="number"
                    id="input"
                    placeholder="Ô tự động điền"
                    onChange={handleEditQuantityChange}
                    value={product?.quantityPerBox}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ProductLabel htmlFor="input">Giao hàng tại</ProductLabel>
                  <StorageGroup
                    product={product}
                    isCreateMode={isCreateMode}
                    onChange={onChange}
                  />
                </div>

                <div>
                  <ProductLabel htmlFor="input">Số ngày giao hàng</ProductLabel>
                  <Input
                    type="text"
                    id="input"
                    placeholder="Số ngày giao hàng"
                    value={deliveryEstimatedDate}
                    onChange={handleDeliveryEstimatedDateChange}
                  />
                </div>
              </div>
            </div>

            {/* Cột phải */}
            <div className="space-y-6">
              <div>
                <ProductLabel htmlFor="input">Mã số nhà cung cấp</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  value={product?.supplierItemCode || ""}
                  placeholder="Mã số sản phẩm của nhà cung cấp"
                  onChange={(e) =>
                    onChange && onChange("supplierItemCode", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ProductLabel htmlFor="input">Số thứ tự</ProductLabel>
                  <Input
                    type="number"
                    id="input"
                    placeholder="Số thứ tự tự động"
                    disabled
                    value={product?.productOrderNumber || ""}
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="input">Mã sản phẩm</ProductLabel>
                  <Input
                    type="text"
                    id="input"
                    placeholder="Mã sản phẩm"
                    disabled
                    value={product?.productCode || undefined}
                  />
                </div>
              </div>

              <div>
                <ProductLabel htmlFor="input">
                  Tên hiển thị website
                </ProductLabel>
                <Input
                  type="text"
                  id="input"
                  placeholder="Ô tự động điền"
                  className="text-red-500"
                  value={product?.displayWebsiteName || ""}
                  onChange={(e) =>
                    onChange && onChange("displayWebsiteName", e.target.value)
                  }
                />
              </div>

              <div>
                <ProductLabel htmlFor="input">Giá khuyến mãi</ProductLabel>
                <NumericFormat
                  value={product?.discountedPrice}
                  thousandSeparator
                  prefix={appCurrency}
                  allowNegative={false}
                  displayType="input"
                  onValueChange={(values) => {
                    const { floatValue } = values;
                    onChange && onChange("discountedPrice", floatValue ?? 0);
                  }}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <ProductLabel htmlFor="input">Đơn vị tính tự động</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  disabled
                  placeholder="Ô tự động điền"
                  className="text-red-500"
                  value={product?.autoCalculatedUnit || ""}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ProductLabel htmlFor="input">Diện tích 1 viên</ProductLabel>
                  <Input
                    type="number"
                    step={0.05}
                    id="input"
                    disabled
                    placeholder="Ô tự động điền"
                    value={product?.areaPerUnit}
                  />
                </div>

                <div>
                  <ProductLabel htmlFor="input">Diện tích 1 thùng</ProductLabel>
                  <Input
                    type="number"
                    step={0.05}
                    id="input"
                    disabled
                    placeholder="Ô tự động điền"
                    value={product?.areaPerBox}
                  />
                </div>
              </div>

              <div>
                <ProductLabel htmlFor="factory">Nhà máy</ProductLabel>
                <FactoryGroup
                  product={product}
                  isCreateMode={isCreateMode}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-6">
            <div className="space-y-0">
              <ProductLabel htmlFor="input">Mã An Khánh</ProductLabel>
              <CompanyCodeGroup
                product={product}
                isCreateMode={isCreateMode}
                onChange={onChange}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Mã số nhà cung cấp</ProductLabel>
              <Input
                type="text"
                id="input"
                value={product?.supplierItemCode || ""}
                placeholder="Mã số sản phẩm của nhà cung cấp"
                onChange={(e) =>
                  onChange && onChange("supplierItemCode", e.target.value)
                }
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Số thứ tự</ProductLabel>
              <Input
                type="number"
                id="input"
                placeholder="Số thứ tự tự động"
                disabled
                value={product?.productOrderNumber || ""}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Mã sản phẩm</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Mã sản phẩm"
                disabled
                value={product?.productCode || undefined}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Mã SKU</ProductLabel>
              <Input
                type="text"
                id="input"
                disabled
                placeholder="Ô tự động điền"
                value={editModeSku}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Mã barcode sản phẩm</ProductLabel>
              <Input
                type="text"
                id="input"
                disabled
                placeholder="Ô tự động điền"
                value={product?.autoBarCode}
                className="text-red-500"
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Tên hiển thị website</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Ô tự động điền"
                className="text-red-500"
                value={product?.displayWebsiteName || ""}
                onChange={(e) =>
                  onChange && onChange("displayWebsiteName", e.target.value)
                }
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Đơn vị tính</ProductLabel>
              <CalculatedUnit
                product={product}
                isCreateMode={isCreateMode}
                onChange={onChange}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Đơn vị tính tự động</ProductLabel>
              <Input
                type="text"
                id="input"
                disabled
                placeholder="Ô tự động điền"
                className="text-red-500"
                value={product?.autoCalculatedUnit || ""}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Giao hàng tại</ProductLabel>
              <StorageGroup
                product={product}
                isCreateMode={isCreateMode}
                onChange={onChange}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Số ngày giao hàng</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Số ngày giao hàng"
                value={deliveryEstimatedDate}
                onChange={handleDeliveryEstimatedDateChange}
              />
            </div>

            <div>
              <ProductLabel htmlFor="factory">Nhà máy</ProductLabel>
              <FactoryGroup
                product={product}
                isCreateMode={isCreateMode}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-10">
              <ProductLabel>Gia công khác</ProductLabel>
              <ProcessingGroup
                product={product}
                isCreateMode={isCreateMode}
                onChange={onChange}
              />
            </div>
            <div className="col-span-2 flex items-end">
              <Button
                className="w-full max-h-[44px] text-md font-semibold bg-[#334355] hover:bg-[#283849] text-white"
                onClick={() => setIsProcessingPriceModalOpen(true)}
              >
                Xem giá
              </Button>
            </div>
          </div>

          <ProcessingPriceModal
            isOpen={isProcessingPriceModalOpen}
            onClose={() => setIsProcessingPriceModalOpen(false)}
            product={product}
          />

          <div className="space-y-6 mt-6">
            <div>
              <ProductLabel htmlFor="input">Ghi chú thêm</ProductLabel>
              <ProductTextArea
                placeholder="Ghi chú thêm"
                value={product?.otherNote || ""}
                onChange={(e) =>
                  onChange && onChange("otherNote", e.target.value)
                }
              />
            </div>
          </div>
        </>
      )}
    </ComponentCard>
  );
};

export default observer(ProductDefaultInputs);
