import React, { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "../stores/store";
import { ProductMetadataDto } from "../models/product/product.model";
import agent from "../api/agent";
import { OfflineStorage } from "../services/offlineStorage";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";

interface ProductMetadata {
  ProductMetadataDto: ProductMetadataDto;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

interface ProductMetadataContextType {
  metadata: ProductMetadata;
  refreshMetadata: () => Promise<void>;
  loading: boolean;
}

const ProductMetadataContext = createContext<ProductMetadataContextType | undefined>(undefined);

export const ProductMetadataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isOnline = useNetworkStatus();
  const {
    supplierStore,
    sizeStore,
    patternStore,
    surfaceStore,
    materialStore,
    colorStore,
    calculatedUnitStore,
    factoryStore,
    processingStore,
    companyCodeStore,
    storageStore,
    originStore,
    bodyColorStore,
    antiSlipperyStore,
    waterAbsorptionStore,
    areaStore,
    supplierTaxStore,
    roleStore
  } = useStore();

  const [metadata, setMetadata] = useState<ProductMetadata>(() => {
    // Try to load from localStorage first
    const savedMetadata = OfflineStorage.getMetadata();
    if (savedMetadata) {
      return {
        ProductMetadataDto: savedMetadata,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      };
    }
    // Default state if no saved metadata
    return {
      ProductMetadataDto: {
        companyCodeDtos: [],
        calculatedUnitDtos: [],
        productAntiSlipperyDtos: [],
        productAreaDtos: [],
        productBodyColorDtos: [],
        productColorDtos: [],
        productFactoryDtos: [],
        productMaterialDtos: [],
        productOriginDtos: [],
        productPatternDtos: [],
        productProcessingDtos: [],
        productSizeDtos: [],
        productStorageDtos: [],
        productSupplierDtos: [],
        productSurfaceDtos: [],
        waterAbsoroptionDtos: [],
        supplierTaxDtos: [],
        roleDtos: []
      },
      loading: true,
      error: null,
      lastUpdated: null
    };
  });

  const loadMetadata = async () => {
    // Nếu đã có metadata trong localStorage thì dùng luôn, không gọi lại API
    const cachedMetadata = OfflineStorage.getMetadata();
    if (cachedMetadata) {
      setMetadata({
        ProductMetadataDto: cachedMetadata,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      });
      // Cập nhật các store liên quan nếu cần
      companyCodeStore.setProductCompanyCodeList(cachedMetadata.companyCodeDtos);
      calculatedUnitStore.setProductCalculatedUnitList(cachedMetadata.calculatedUnitDtos);
      antiSlipperyStore.setProductAntiSlipperyList(cachedMetadata.productAntiSlipperyDtos);
      areaStore.setProductAreaList(cachedMetadata.productAreaDtos);
      bodyColorStore.setProductBodyColorList(cachedMetadata.productBodyColorDtos);
      colorStore.setProductColorList(cachedMetadata.productColorDtos);
      factoryStore.setProductFactoryList(cachedMetadata.productFactoryDtos);
      materialStore.setProductMaterialList(cachedMetadata.productMaterialDtos);
      originStore.setProductOriginList(cachedMetadata.productOriginDtos);
      patternStore.setProductPatternList(cachedMetadata.productPatternDtos);
      processingStore.setProductProcessingList(cachedMetadata.productProcessingDtos);
      sizeStore.setProductSizeList(cachedMetadata.productSizeDtos);
      storageStore.setProductStorageList(cachedMetadata.productStorageDtos);
      supplierStore.setProductSupplierList(cachedMetadata.productSupplierDtos);
      surfaceStore.setProductSurfaceList(cachedMetadata.productSurfaceDtos);
      waterAbsorptionStore.setProductWaterAbsorptionList(cachedMetadata.waterAbsoroptionDtos);
      supplierTaxStore.setProductSupplierTaxList(cachedMetadata.supplierTaxDtos);
      roleStore.setRoleList(cachedMetadata.roleDtos);
      return;
    }

    // Nếu không có metadata, mới gọi API
    try {
      setMetadata((prev) => ({ ...prev, loading: true, error: null }));
      const response = await agent.Product.getProductMetadata();
      if (response && response.data) {
        const fetchedMetadata = response.data;
        OfflineStorage.saveMetadata(fetchedMetadata);
        // Update stores
        companyCodeStore.setProductCompanyCodeList(fetchedMetadata.companyCodeDtos);
        calculatedUnitStore.setProductCalculatedUnitList(fetchedMetadata.calculatedUnitDtos);
        antiSlipperyStore.setProductAntiSlipperyList(fetchedMetadata.productAntiSlipperyDtos);
        areaStore.setProductAreaList(fetchedMetadata.productAreaDtos);
        bodyColorStore.setProductBodyColorList(fetchedMetadata.productBodyColorDtos);
        colorStore.setProductColorList(fetchedMetadata.productColorDtos);
        factoryStore.setProductFactoryList(fetchedMetadata.productFactoryDtos);
        materialStore.setProductMaterialList(fetchedMetadata.productMaterialDtos);
        originStore.setProductOriginList(fetchedMetadata.productOriginDtos);
        patternStore.setProductPatternList(fetchedMetadata.productPatternDtos);
        processingStore.setProductProcessingList(fetchedMetadata.productProcessingDtos);
        sizeStore.setProductSizeList(fetchedMetadata.productSizeDtos);
        storageStore.setProductStorageList(fetchedMetadata.productStorageDtos);
        supplierStore.setProductSupplierList(fetchedMetadata.productSupplierDtos);
        surfaceStore.setProductSurfaceList(fetchedMetadata.productSurfaceDtos);
        waterAbsorptionStore.setProductWaterAbsorptionList(fetchedMetadata.waterAbsoroptionDtos);
        supplierTaxStore.setProductSupplierTaxList(fetchedMetadata.supplierTaxDtos);
        roleStore.setRoleList(fetchedMetadata.roleDtos);
        setMetadata({
          ProductMetadataDto: fetchedMetadata,
          loading: false,
          error: null,
          lastUpdated: Date.now()
        });
      } else {
        throw new Error('No data received from product metadata API');
      }
    } catch (error) {
      console.error('Error loading metadata:', error);
      // If we have cached metadata, use it
      const cachedMetadata = OfflineStorage.getMetadata();
      if (cachedMetadata) {
        setMetadata({
          ProductMetadataDto: cachedMetadata,
          loading: false,
          error: null,
          lastUpdated: Date.now()
        });
      } else {
        setMetadata((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load metadata",
          lastUpdated: null
        }));
      }
    }
  };

  // Effect for initial load and periodic refresh
  useEffect(() => {
    const shouldLoadMetadata = isOnline && (
      !metadata.lastUpdated || 
      Date.now() - metadata.lastUpdated > 3600000 // 1 hour
    );

    if (shouldLoadMetadata) {
      loadMetadata();
    }
  }, [isOnline, metadata.lastUpdated]);

  // Effect to watch for category changes
  useEffect(() => {
    if (!isOnline) return;

    const handleCategoryChange = () => {
      loadMetadata();
    };

    // Subscribe to category changes
    const disposers = [
      supplierStore.addChangeListener(handleCategoryChange),
      // sizeStore.addChangeListener(handleCategoryChange),
      // patternStore.addChangeListener(handleCategoryChange),
      // surfaceStore.addChangeListener(handleCategoryChange),
      // materialStore.addChangeListener(handleCategoryChange),
      // colorStore.addChangeListener(handleCategoryChange),
      // calculatedUnitStore.addChangeListener(handleCategoryChange),
      // factoryStore.addChangeListener(handleCategoryChange),
      // processingStore.addChangeListener(handleCategoryChange),
      // companyCodeStore.addChangeListener(handleCategoryChange),
      // storageStore.addChangeListener(handleCategoryChange),
      // originStore.addChangeListener(handleCategoryChange),
      // bodyColorStore.addChangeListener(handleCategoryChange),
      // antiSlipperyStore.addChangeListener(handleCategoryChange),
      // waterAbsorptionStore.addChangeListener(handleCategoryChange),
      // areaStore.addChangeListener(handleCategoryChange),
      // supplierTaxStore.addChangeListener(handleCategoryChange),
      // roleStore.addChangeListener(handleCategoryChange)
    ];

    return () => {
      disposers.forEach(dispose => dispose());
    };
  }, [isOnline]);

  return (
    <ProductMetadataContext.Provider
      value={{
        metadata,
        refreshMetadata: loadMetadata,
        loading: metadata.loading,
      }}
    >
      {children}
    </ProductMetadataContext.Provider>
  );
};

export const useProductMetadata = () => {
  const context = useContext(ProductMetadataContext);
  if (context === undefined) {
    throw new Error(
      "useProductMetadata must be used within a ProductMetadataProvider"
    );
  }
  return context;
};
