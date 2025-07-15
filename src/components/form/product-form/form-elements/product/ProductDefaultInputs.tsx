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
import ProcessingPriceModal from "./ProcessingPriceModal";
import { toast } from "react-toastify";

interface ProductProps {
  product?: ProductDetail;
  isCreateMode: boolean;
  onChange?: (field: string, value: unknown) => void;
  onValidationChange?: (
    field: string,
    isValid: boolean,
    errorMessage?: string
  ) => void;
}

const ProductDefaultInputs = ({
  product,
  isCreateMode,
  onChange,
  onValidationChange,
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
    originStore,
  } = useStore();

  const { productSizeList } = sizeStore;
  const { productSupplierList } = supplierStore;
  const { productCompanyCodeList } = companyCodeStore;
  const { productPatternList } = patternStore;
  const { productColorList } = colorStore;
  const { productBodyColorList } = bodyColorStore;
  const { productMaterialList } = materialStore;
  const { productSurfaceList } = surfaceStore;
  const { productOriginList } = originStore;
  const { getNextOrderNumberAuto } = productStore;

  const [supplierItemCode, setSupplierItemCode] = useState<string>("");
  const [isValidSupplierCode, setIsValidSupplierCode] = useState<
    boolean | null
  >(null);
  const [websiteProductName, setWebsiteProductName] = useState<string>("");
  const [sapo, setSapo] = useState<string>("");
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

  // Hàm sinh autoBarCode mới
  const handleAutoBarCode = ({
    supplierId,
    orderNumber,
    patternId,
  }: {
    supplierId?: number;
    orderNumber?: string | number | null;
    patternId?: number;
  }) => {
    if (!supplierId || !orderNumber) return "";
    const supplier = productSupplierList.find((x) => x.id === supplierId);
    const pattern = productPatternList.find((x) => x.id === patternId);
    if (!supplier?.supplierShortCode) return "";
    const patternCode = pattern?.shortCode || "";
    return `${supplier.supplierShortCode}.${orderNumber}${patternCode}`;
  };

  // Add effect để cập nhật autoBarCode khi các trường liên quan thay đổi
  useEffect(() => {
    if (isCreateMode) {
      const newBarCode = handleAutoBarCode({
        supplierId: productStore.productForm.supplierId ?? undefined,
        orderNumber:
          (isOnline
            ? productStore.productForm.productOrderNumber
            : manualOrderNumber) ?? undefined,
        patternId: productStore.productForm.brickPatternId ?? undefined,
      });
      productStore.updateProductForm("autoBarCode", newBarCode);
    }
  }, [
    isCreateMode,
    productStore.productForm.supplierId,
    productStore.productForm.productOrderNumber,
    manualOrderNumber,
    productStore.productForm.brickPatternId,
    productPatternList,
    productSupplierList,
    isOnline,
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
    if (isCreateMode) {
      handleProductCodeChange();
    }
  }, [
    isCreateMode,
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
    handleAutoBarCode({
      supplierId: productStore.productForm.supplierId ?? undefined,
      orderNumber: numericValue ?? undefined,
      patternId: productStore.productForm.brickPatternId ?? undefined,
    });
  };

  // const handleConfirmProductCodeChange = () => {
  //   if (productStore.productForm.companyCodeId && supplierItemCode) {
  //     const companyCode = productCompanyCodeList.find(
  //       (x) => x.id === productStore.productForm.companyCodeId
  //     );

  //     const lastSixChars = supplierItemCode.slice(-6);

  //     if (companyCode?.codeName) {
  //       const newSkuCode = `${companyCode.codeName} ${lastSixChars}`;
  //       productStore.updateProductForm("confirmSupplierItemCode", newSkuCode);
  //     }
  //   }
  // };

  // Add effect to update SKU when supplierItemCode changes
  // useEffect(() => {
  //   handleConfirmProductCodeChange();
  // }, [supplierItemCode, productStore.productForm.companyCodeId]);

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
          `${productStore.productForm.autoBarCode} - ${actualSize} - ${pattern.name} ${color?.name} ${surfaceFeature?.name} ${material?.name} ${bodyColor?.name}`.trim();
        setWebsiteProductName(newWebsiteProductName);
        productStore.updateProductForm(
          "displayWebsiteName",
          newWebsiteProductName
        );
      }
    }
  };

  const handleSapoNameChange = () => {
    if (
      productStore.productForm.brickPatternId &&
      productStore.productForm.colorId &&
      productStore.productForm.materialId &&
      productStore.productForm.surfaceFeatureId &&
      productStore.productForm.originCountryId &&
      productStore.productForm.companyCodeId
    ) {
      const pattern = productPatternList.find(
        (x) => x.id === productStore.productForm.brickPatternId
      );

      const originCountry = productOriginList.find(
        (x) => x.id === productStore.productForm.originCountryId
      );

      const color = productColorList.find(
        (x) => x.id === productStore.productForm.colorId
      );

      const material = productMaterialList.find(
        (x) => x.id === productStore.productForm.materialId
      );

      const surfaceFeature = productSurfaceList.find(
        (x) => x.id === productStore.productForm.surfaceFeatureId
      );

      const companyCode = productCompanyCodeList.find(
        (x) => x.id === productStore.productForm.companyCodeId
      );

      const codeName = companyCode?.codeName;

      let codeNameResult = "";

      if (codeName) {
        const akIndex = codeName.indexOf("AK");
        if (akIndex !== -1) {
          codeNameResult = codeName.substring(0, akIndex);
        } else {
          codeNameResult = codeName;
        }
      }

      const surfaceShortCode = surfaceFeature?.shortCode;

      let surfaceFeatureName = "";

      if (surfaceShortCode) {
        const firstChar = String(surfaceShortCode).charAt(0).toUpperCase();

        switch (firstChar) {
          case "M":
            surfaceFeatureName = "MỜ";
            break;
          case "G":
            surfaceFeatureName = "BÓNG";
            break;
          case "P":
            surfaceFeatureName = "SẦN";
            break;
          case "L":
            surfaceFeatureName = "BÁN BÓNG";
            break;
          case "D":
            surfaceFeatureName = "DECOR";
            break;
          case "K":
            surfaceFeatureName = "KEO";
            break;
          case "T":
            surfaceFeatureName = "TOILET";
            break;
          case "H":
            surfaceFeatureName = "NÓNG-LẠNH";
            break;
          case "C":
            surfaceFeatureName = "LẠNH";
            break;
        }
      }

      const productName =
        productStore.productForm.productSpecialNote ||
        productStore.productForm.supplierItemCode;

      if (productName) {
        const newSapoProductName =
          `${codeNameResult} - ${productName} - ${originCountry?.upperName} - ${material?.shortName} - ${color?.name},${pattern?.shortName},${surfaceFeatureName}`.trim();
        setSapo(newSapoProductName);
        productStore.updateProductForm("sapoName", newSapoProductName);
      }
    }
  };

  useEffect(() => {
    if (isCreateMode) {
      handleWebsiteProductNameChange();
      handleSapoNameChange();
    }
  }, [
    isCreateMode,
    productStore.productForm.autoBarCode,
    productStore.productForm.brickPatternId,
    productStore.productForm.actualSizeId,
    productStore.productForm.colorId,
    productStore.productForm.brickBodyId,
    productStore.productForm.materialId,
    productStore.productForm.surfaceFeatureId,
    productStore.productForm.productSpecialNote,
    productStore.productForm.supplierItemCode,
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
      if (onChange) {
        onChange("deliveryEstimatedDate", value);
      }
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
    if (onChange) {
      onChange("supplierItemCode", supplierItemCodeValue);
      onChange("confirmSupplierItemCode", newConfirmSupplierItemCode);
    }
  };

  // Debounced check function
  const debouncedCheck = useCallback(
    debounce(async (value: string) => {
      if (!value) {
        setIsValidSupplierCode(null);
        onValidationChange && onValidationChange("supplierItemCode", true);
        return;
      }
      setIsChecking(true);
      try {
        const isValid = await productStore.checkSupplierItemCode(value);
        const isDuplicate = !isValid; // Nếu không valid thì có nghĩa là trùng
        setIsValidSupplierCode(isDuplicate);

        // Gửi trạng thái validation về component cha
        if (onValidationChange) {
          if (isDuplicate) {
            toast.error("Mã sản phẩm này đã tồn tại trong hệ thống");
            onValidationChange(
              "supplierItemCode",
              false,
              "Mã sản phẩm này đã tồn tại trong hệ thống"
            );
          } else {
            onValidationChange("supplierItemCode", true);
          }
        }
      } catch (error) {
        console.error("Error checking supplier code:", error);
        setIsValidSupplierCode(false);
        toast.error("Lỗi khi kiểm tra mã sản phẩm");
        onValidationChange &&
          onValidationChange(
            "supplierItemCode",
            false,
            "Lỗi khi kiểm tra mã sản phẩm"
          );
      } finally {
        setIsChecking(false);
      }
    }, 500),
    [onValidationChange]
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
    if (isCreateMode && productStore.productForm.supplierId) {
      // Tạo mới: luôn lấy orderNumber mới
      getNextOrderNumberAuto();
    } else if (
      !isCreateMode &&
      product &&
      product.supplierId !== productStore.productForm.supplierId
    ) {
      // Edit: chỉ khi đổi supplier mới lấy orderNumber mới
      getNextOrderNumberAuto();
    }
    // Các trường hợp khác KHÔNG gọi getNextOrderNumberAuto!
  }, [isCreateMode, productStore.productForm.supplierId]);

  // useEffect riêng cho pattern - chỉ cập nhật autoBarCode và displayWebsiteName, không đổi orderNumber
  useEffect(() => {
    if (!isCreateMode && product?.brickPatternId && product?.supplierId) {
      const supplier = productSupplierList.find(
        (x) => x.id === product.supplierId
      );
      const pattern = productPatternList.find(
        (x) => x.id === product.brickPatternId
      );

      if (supplier?.supplierShortCode) {
        // Cập nhật autoBarCode với orderNumber hiện tại (không tăng)
        const currentOrderNumber = product.productOrderNumber || "";
        const patternCode = pattern?.shortCode || "";
        const newBarCode = `${supplier.supplierShortCode}.${currentOrderNumber}${patternCode}`;
        if (onChange) {
          onChange("autoBarCode", newBarCode);
        }

        // Cập nhật displayWebsiteName
        updateDisplayWebsiteName(currentOrderNumber);
      }
    }
  }, [isCreateMode ? null : product?.brickPatternId]);

  // Hàm helper để cập nhật displayWebsiteName
  const updateDisplayWebsiteName = (
    orderNumber: string | number | undefined
  ) => {
    if (
      product?.supplierId &&
      product?.brickPatternId &&
      product?.actualSizeId &&
      product?.colorId &&
      product?.brickBodyId &&
      product?.materialId &&
      product?.surfaceFeatureId &&
      orderNumber !== undefined
    ) {
      const supplier = productSupplierList.find(
        (x) => x.id === product.supplierId
      );
      const pattern = productPatternList.find(
        (x) => x.id === product.brickPatternId
      );
      const size = productSizeList.find((x) => x.id === product.actualSizeId);
      const color = productColorList.find((x) => x.id === product.colorId);
      const bodyColor = productBodyColorList.find(
        (x) => x.id === product.brickBodyId
      );
      const material = productMaterialList.find(
        (x) => x.id === product.materialId
      );
      const surfaceFeature = productSurfaceList.find(
        (x) => x.id === product.surfaceFeatureId
      );

      const actualSize = size
        ? `${Number(size.wide) / 10} x ${Number(size.length) / 10} cm`
        : "";

      if (pattern?.name && supplier?.supplierShortCode) {
        const patternCode = pattern.shortCode || "";
        const autoBarCode = `${supplier.supplierShortCode}.${orderNumber}${patternCode}`;
        const newWebsiteProductName =
          `${autoBarCode} - ${actualSize} - ${pattern.name} ${color?.name} ${surfaceFeature?.name} ${material?.name} ${bodyColor?.name}`.trim();

        if (onChange) {
          onChange("displayWebsiteName", newWebsiteProductName);
        }
      }
    }
  };

  // Hàm cập nhật tên SAPO cho edit mode
  const updateSapoNameForEdit = () => {
    if (
      product?.brickPatternId &&
      product?.colorId &&
      product?.materialId &&
      product?.surfaceFeatureId &&
      product?.originCountryId &&
      product?.companyCodeId
    ) {
      const pattern = productPatternList.find(
        (x) => x.id === product.brickPatternId
      );

      const originCountry = productOriginList.find(
        (x) => x.id === product.originCountryId
      );

      const color = productColorList.find((x) => x.id === product.colorId);

      const material = productMaterialList.find(
        (x) => x.id === product.materialId
      );

      const surfaceFeature = productSurfaceList.find(
        (x) => x.id === product.surfaceFeatureId
      );

      const companyCode = productCompanyCodeList.find(
        (x) => x.id === product.companyCodeId
      );

      const codeName = companyCode?.codeName;

      let codeNameResult = "";

      if (codeName) {
        const akIndex = codeName.indexOf("AK");
        if (akIndex !== -1) {
          codeNameResult = codeName.substring(0, akIndex);
        } else {
          codeNameResult = codeName;
        }
      }

      const featureName = surfaceFeature?.name;

      let surfaceFeatureName = "";

      if (featureName) {
        const spaceIndex = featureName.indexOf(" ");
        if (spaceIndex !== -1) {
          surfaceFeatureName = featureName.substring(0, spaceIndex);
        } else {
          surfaceFeatureName = featureName;
        }
      }

      // Sử dụng productSpecialNote (englishName) nếu có, nếu không thì dùng supplierItemCode
      const productName =
        product.productSpecialNote || product.supplierItemCode;

      if (productName) {
        const newSapoProductName =
          `${codeNameResult} - ${productName} - ${originCountry?.upperName} - ${material?.shortName} - ${color?.name},${pattern?.shortName},${surfaceFeatureName}`.trim();

        if (onChange) {
          onChange("sapoName", newSapoProductName);
        }
      }
    }
  };

  // Thêm hàm generateSku
  const generateSku = ({
    companyCodeId,
    supplierId,
    supplierItemCode,
    surfaceFeatureId,
    companyCodeList,
    supplierList,
    surfaceList,
  }: {
    companyCodeId?: number;
    supplierId?: number;
    supplierItemCode?: string;
    surfaceFeatureId?: number;
    companyCodeList: any[];
    supplierList: any[];
    surfaceList: any[];
  }) => {
    const companyCode = companyCodeList.find((x) => x.id === companyCodeId);
    const supplier = supplierList.find((x) => x.id === supplierId);
    const surface = surfaceList.find((x) => x.id === surfaceFeatureId);
    if (!companyCode || !supplier || !supplierItemCode || !surface) return "";
    return `${companyCode.codeName}-${supplier.supplierCombinedCode}-${supplierItemCode}-${surface.shortCode}`;
  };

  // Tạo state cho SKU nếu cần
  const [sku, setSku] = useState("");

  // useEffect cho create mode
  useEffect(() => {
    if (isCreateMode) {
      const newSku = generateSku({
        companyCodeId: productStore.productForm.companyCodeId ?? undefined,
        supplierId: productStore.productForm.supplierId ?? undefined,
        supplierItemCode: supplierItemCode,
        surfaceFeatureId:
          productStore.productForm.surfaceFeatureId ?? undefined,
        companyCodeList: productCompanyCodeList,
        supplierList: productSupplierList,
        surfaceList: productSurfaceList,
      });
      setSku(newSku);
      productStore.updateProductForm("confirmSupplierItemCode", newSku);
    }
  }, [
    isCreateMode,
    productStore.productForm.companyCodeId,
    productStore.productForm.supplierId,
    supplierItemCode,
    productStore.productForm.surfaceFeatureId,
    productCompanyCodeList,
    productSupplierList,
    productSurfaceList,
  ]);

  // useEffect cho edit mode
  useEffect(() => {
    if (!isCreateMode && product) {
      const newSku = generateSku({
        companyCodeId: product.companyCodeId ?? undefined,
        supplierId: product.supplierId ?? undefined,
        supplierItemCode: product.supplierItemCode,
        surfaceFeatureId: product.surfaceFeatureId ?? undefined,
        companyCodeList: productCompanyCodeList,
        supplierList: productSupplierList,
        surfaceList: productSurfaceList,
      });
      setSku(newSku);
      if (onChange) onChange("confirmSupplierItemCode", newSku);
    }
  }, [
    isCreateMode,
    product?.companyCodeId,
    product?.supplierId,
    product?.supplierItemCode,
    product?.surfaceFeatureId,
    productCompanyCodeList,
    productSupplierList,
    productSurfaceList,
  ]);

  // useEffect để cập nhật tên SAPO khi productSpecialNote thay đổi trong edit mode
  useEffect(() => {
    if (!isCreateMode && product) {
      updateSapoNameForEdit();
    }
  }, [
    isCreateMode,
    product?.productSpecialNote,
    product?.supplierItemCode,
    product?.brickPatternId,
    product?.colorId,
    product?.materialId,
    product?.surfaceFeatureId,
    product?.originCountryId,
    product?.companyCodeId,
    productPatternList,
    productColorList,
    productMaterialList,
    productSurfaceList,
    productOriginList,
    productCompanyCodeList,
  ]);

  return (
    <ComponentCard title="Thông tin mã hàng">
      {isCreateMode ? (
        <>
          {/* PHẦN 1: 2 cột */}
          <div className="grid grid-cols-2 gap-6">
            {/* Cột trái */}
            <div className="space-y-6">
              <div>
                <ProductLabel htmlFor="input">Mã An Khánh</ProductLabel>
                <CompanyCodeGroup
                  product={product}
                  isCreateMode={isCreateMode}
                />
              </div>
              <div>
                <ProductLabel htmlFor="input">Tên tiếng anh</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  placeholder="English name"
                  value={
                    isCreateMode
                      ? productStore.productForm.productSpecialNote || ""
                      : product?.productSpecialNote || ""
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value.toUpperCase();
                    if (isCreateMode) {
                      productStore.updateProductForm(
                        "productSpecialNote",
                        value
                      );
                    } else {
                      if (onChange) {
                        onChange("productSpecialNote", value);
                      }
                    }
                  }}
                />
              </div>
              <div>
                <ProductLabel htmlFor="input">Mã SKU</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  disabled
                  placeholder="Ô tự động điền"
                  value={sku}
                  onChange={() => {}}
                />
              </div>
            </div>
            {/* Cột phải */}
            <div className="space-y-6">
              <div>
                <ProductLabel htmlFor="input">Mã số nhà cung cấp</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  value={
                    isCreateMode
                      ? supplierItemCode
                      : product?.supplierItemCode || ""
                  }
                  placeholder="Mã số sản phẩm của nhà cung cấp"
                  onChange={
                    isCreateMode
                      ? handleSupplierItemCodeChange
                      : (e) => {
                          if (onChange) {
                            onChange("supplierItemCode", e.target.value);
                          }
                        }
                  }
                  className={
                    isCreateMode
                      ? `
                    ${
                      isValidSupplierCode === null
                        ? ""
                        : isValidSupplierCode
                        ? "text-blue-500"
                        : "text-red-500"
                    }
                    ${isChecking ? "opacity-50" : ""}`
                      : ""
                  }
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
            </div>
          </div>

          {/* PHẦN 2: Tên SAPO và Tên hiển thị website */}
          <div className="mt-6 space-y-6">
            <div>
              <ProductLabel htmlFor="input">Tên SAPO</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Tên SAPO"
                value={product?.sapoName || sapo || ""}
                onChange={handleWebsiteProductNameChange}
              />
            </div>
            <div>
              <ProductLabel htmlFor="input">Tên hiển thị website</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Ô tự động điền"
                className="text-red-500 w-full"
                value={product?.displayWebsiteName || websiteProductName || ""}
                onChange={handleWebsiteProductNameChange}
              />
            </div>
          </div>

          {/* PHẦN 3: 2 cột */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Cột trái */}
            <div className="space-y-6">
              <div>
                <ProductLabel htmlFor="input">Đơn vị tính</ProductLabel>
                <CalculatedUnit product={product} isCreateMode={isCreateMode} />
              </div>
              {/* Giao hàng tại và Số ngày giao hàng cùng 1 row 2 col */}
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

          {/* PHẦN 4: Gia công khác và Ghi chú thêm */}
          <div className="mt-6 space-y-6">
            <div>
              <ProductLabel>Gia công khác</ProductLabel>
              <ProcessingGroup product={product} isCreateMode={isCreateMode} />
            </div>
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
          {/* PHẦN 1: 2 cột */}
          <div className="grid grid-cols-2 gap-6">
            {/* Cột trái */}
            <div className="space-y-6">
              <div>
                <ProductLabel htmlFor="input">Mã An Khánh</ProductLabel>
                <CompanyCodeGroup
                  product={product}
                  isCreateMode={isCreateMode}
                  onChange={onChange}
                />
              </div>
              <div>
                <ProductLabel htmlFor="input">Tên tiếng anh</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  placeholder="English name"
                  value={product?.productSpecialNote || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value.toUpperCase();
                    if (onChange) {
                      onChange("productSpecialNote", value);
                    }
                  }}
                />
              </div>
              <div>
                <ProductLabel htmlFor="input">Mã SKU</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  disabled
                  placeholder="Ô tự động điền"
                  value={sku}
                />
              </div>
            </div>
            {/* Cột phải */}
            <div className="space-y-6">
              <div>
                <ProductLabel htmlFor="input">Mã số nhà cung cấp</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  value={
                    isCreateMode
                      ? supplierItemCode
                      : product?.supplierItemCode || ""
                  }
                  placeholder="Mã số sản phẩm của nhà cung cấp"
                  onChange={
                    isCreateMode
                      ? handleSupplierItemCodeChange
                      : (e) => {
                          if (onChange) {
                            onChange("supplierItemCode", e.target.value);
                          }
                        }
                  }
                  className={
                    isCreateMode
                      ? `${
                          isValidSupplierCode === null
                            ? ""
                            : isValidSupplierCode
                            ? "text-blue-500"
                            : "text-red-500"
                        } ${isChecking ? "opacity-50" : ""}`
                      : ""
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
            </div>
          </div>

          {/* PHẦN 2: Tên SAPO và Tên hiển thị website */}
          <div className="mt-6 space-y-6">
            <div>
              <ProductLabel htmlFor="input">Tên SAPO</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Tên SAPO"
                value={product?.sapoName || ""}
                onChange={(e) => {
                  if (onChange) {
                    onChange("sapoName", e.target.value);
                  }
                }}
              />
            </div>
            <div>
              <ProductLabel htmlFor="input">Tên hiển thị website</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Tên website"
                value={product?.displayWebsiteName || ""}
                onChange={(e) => {
                  if (onChange) {
                    onChange("displayWebsiteName", e.target.value);
                  }
                }}
              />
            </div>
          </div>

          {/* PHẦN 3: 2 cột */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Cột trái */}
            <div className="space-y-6">
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
                    if (onChange) {
                      onChange("productPrice", floatValue ?? 0);
                    }
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
              {/* Giao hàng tại và Số ngày giao hàng cùng 1 row 2 col */}
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
                <ProductLabel htmlFor="input">Giá khuyến mãi</ProductLabel>
                <NumericFormat
                  value={product?.discountedPrice}
                  thousandSeparator
                  prefix={appCurrency}
                  allowNegative={false}
                  displayType="input"
                  onValueChange={(values) => {
                    const { floatValue } = values;
                    if (onChange) {
                      onChange("discountedPrice", floatValue ?? 0);
                    }
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
              <ProductLabel htmlFor="input">Tên tiếng anh</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="English name"
                value={product?.productSpecialNote || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value.toUpperCase();
                  if (onChange) {
                    onChange("productSpecialNote", value);
                  }
                }}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Mã số nhà cung cấp</ProductLabel>
              <Input
                type="text"
                id="input"
                value={
                  isCreateMode
                    ? supplierItemCode
                    : product?.supplierItemCode || ""
                }
                placeholder="Mã số sản phẩm của nhà cung cấp"
                onChange={
                  isCreateMode
                    ? handleSupplierItemCodeChange
                    : (e) => {
                        if (onChange) {
                          onChange("supplierItemCode", e.target.value);
                        }
                      }
                }
                className={
                  isCreateMode
                    ? `${
                        isValidSupplierCode === null
                          ? ""
                          : isValidSupplierCode
                          ? "text-blue-500"
                          : "text-red-500"
                      } ${isChecking ? "opacity-50" : ""}`
                    : ""
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
                value={sku}
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
              <ProductLabel htmlFor="input">Tên SAPO</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Tên SAPO"
                value={product?.sapoName || ""}
                onChange={(e) => {
                  if (onChange) {
                    onChange("sapoName", e.target.value);
                  }
                }}
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
                onChange={(e) => {
                  if (onChange) {
                    onChange("displayWebsiteName", e.target.value);
                  }
                }}
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

          {/* PHẦN 4: Gia công khác và Ghi chú thêm */}
          <div className="mt-6 space-y-6">
            <div>
              <ProductLabel>Gia công khác</ProductLabel>
              <ProcessingGroup
                product={product}
                isCreateMode={isCreateMode}
                onChange={onChange}
              />
            </div>
            <div>
              <ProductLabel htmlFor="input">Ghi chú thêm</ProductLabel>
              <ProductTextArea
                placeholder="Ghi chú thêm"
                value={product?.otherNote || ""}
                onChange={(e) => {
                  if (onChange) {
                    onChange("otherNote", e.target.value);
                  }
                }}
              />
            </div>
          </div>

          <ProcessingPriceModal
            isOpen={isProcessingPriceModalOpen}
            onClose={() => setIsProcessingPriceModalOpen(false)}
            product={product}
          />
        </>
      )}
    </ComponentCard>
  );
};

export default observer(ProductDefaultInputs);
