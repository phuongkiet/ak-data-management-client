import React, { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "../stores/store";
import { ProductMetadataDto } from "../models/product/product.model";
import agent from "../api/agent";
import { OfflineStorage } from "../services/offlineStorage";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";
import { runInAction } from "mobx";

interface ProductMetadata {
  ProductMetadataDto: ProductMetadataDto;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

interface ProductMetadataContextType {
  metadata: ProductMetadata;
  refreshMetadata: (forceRefresh?: boolean) => Promise<void>;
  syncMetadataFromStores: () => void;
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
    const savedMetadata = OfflineStorage.getMetadata();
    if (savedMetadata) {
      return {
        ProductMetadataDto: savedMetadata,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      };
    }
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

  const updateStores = (metadata: ProductMetadataDto) => {
    runInAction(() => {
      companyCodeStore.setProductCompanyCodeList(metadata.companyCodeDtos);
      calculatedUnitStore.setProductCalculatedUnitList(metadata.calculatedUnitDtos);
      antiSlipperyStore.setProductAntiSlipperyList(metadata.productAntiSlipperyDtos);
      areaStore.setProductAreaList(metadata.productAreaDtos);
      bodyColorStore.setProductBodyColorList(metadata.productBodyColorDtos);
      colorStore.setProductColorList(metadata.productColorDtos);
      factoryStore.setProductFactoryList(metadata.productFactoryDtos);
      materialStore.setProductMaterialList(metadata.productMaterialDtos);
      originStore.setProductOriginList(metadata.productOriginDtos);
      patternStore.setProductPatternList(metadata.productPatternDtos);
      processingStore.setProductProcessingList(metadata.productProcessingDtos);
      sizeStore.setProductSizeList(metadata.productSizeDtos);
      storageStore.setProductStorageList(metadata.productStorageDtos);
      supplierStore.setProductSupplierList(metadata.productSupplierDtos);
      surfaceStore.setProductSurfaceList(metadata.productSurfaceDtos);
      waterAbsorptionStore.setProductWaterAbsorptionList(metadata.waterAbsoroptionDtos);
      supplierTaxStore.setProductSupplierTaxList(metadata.supplierTaxDtos);
      roleStore.setRoleList(metadata.roleDtos);
    });
  };

  const syncMetadataFromStores = () => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      // Sync từ các store vào metadata
      currentMetadata.companyCodeDtos = companyCodeStore.productCompanyCodeList;
      currentMetadata.calculatedUnitDtos = calculatedUnitStore.productCalculatedUnitList;
      currentMetadata.productAntiSlipperyDtos = antiSlipperyStore.productAntiSlipperyList;
      currentMetadata.productAreaDtos = areaStore.productAreaList;
      currentMetadata.productBodyColorDtos = bodyColorStore.productBodyColorList;
      currentMetadata.productColorDtos = colorStore.productColorList;
      currentMetadata.productFactoryDtos = factoryStore.productFactoryList;
      currentMetadata.productMaterialDtos = materialStore.productMaterialList;
      currentMetadata.productOriginDtos = originStore.productOriginList;
      currentMetadata.productPatternDtos = patternStore.productPatternList;
      currentMetadata.productProcessingDtos = processingStore.productProcessingList;
      currentMetadata.productSizeDtos = sizeStore.productSizeList;
      currentMetadata.productStorageDtos = storageStore.productStorageList;
      currentMetadata.productSupplierDtos = supplierStore.productSupplierList;
      currentMetadata.productSurfaceDtos = surfaceStore.productSurfaceList;
      currentMetadata.waterAbsoroptionDtos = waterAbsorptionStore.productWaterAbsorptionList;
      currentMetadata.supplierTaxDtos = supplierTaxStore.productSupplierTaxList;
      currentMetadata.roleDtos = roleStore.roleList;
      
      // Lưu lại vào localStorage
      OfflineStorage.saveMetadata(currentMetadata);
      
      // Cập nhật state
      setMetadata({
        ProductMetadataDto: currentMetadata,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      });
    }
  };

  const loadMetadata = async (forceRefresh: boolean = false) => {
    // Nếu không force refresh và có cache, sử dụng cache
    if (!forceRefresh) {
      const cachedMetadata = OfflineStorage.getMetadata();
      if (cachedMetadata) {
        setMetadata({
          ProductMetadataDto: cachedMetadata,
          loading: false,
          error: null,
          lastUpdated: Date.now()
        });
        updateStores(cachedMetadata);
        return;
      }
    }

    try {
      setMetadata((prev) => ({ ...prev, loading: true, error: null }));
      const response = await agent.Product.getProductMetadata();
      if (response && response.data) {
        const fetchedMetadata = response.data;
        OfflineStorage.saveMetadata(fetchedMetadata);
        updateStores(fetchedMetadata);
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
      const cachedMetadata = OfflineStorage.getMetadata();
      if (cachedMetadata) {
        setMetadata({
          ProductMetadataDto: cachedMetadata,
          loading: false,
          error: null,
          lastUpdated: Date.now()
        });
        updateStores(cachedMetadata);
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

  useEffect(() => {
    const shouldLoadMetadata = isOnline && (
      !metadata.lastUpdated || 
      Date.now() - metadata.lastUpdated > 3600000 // 1 hours
    );

    if (shouldLoadMetadata) {
      loadMetadata();
    }
  }, [isOnline, metadata.lastUpdated]);

  // Đảm bảo luôn đồng bộ metadata vào các store MobX khi metadata thay đổi
  useEffect(() => {
    if (metadata.ProductMetadataDto) {
      updateStores(metadata.ProductMetadataDto);
    }
  }, [metadata.ProductMetadataDto]);

  return (
    <ProductMetadataContext.Provider
      value={{
        metadata,
        refreshMetadata: (forceRefresh = false) => loadMetadata(forceRefresh),
        syncMetadataFromStores,
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
