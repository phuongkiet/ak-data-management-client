import React, { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "../stores/store";
import { ProductMetadataDto } from "../models/product/product.model";
import agent from "../api/agent";
interface ProductMetadata {
  ProductMetadataDto: ProductMetadataDto;
  loading: boolean;
  error: string | null;
}

interface ProductMetadataContextType {
  metadata: ProductMetadata;
  refreshMetadata: () => Promise<void>;
  loading: boolean;
}

const ProductMetadataContext = createContext<
  ProductMetadataContextType | undefined
>(undefined);

export const ProductMetadataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
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
  const [metadata, setMetadata] = useState<ProductMetadata>({
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
  });

  const loadMetadata = async () => {
    try {
      setMetadata((prev) => ({ ...prev, loading: true, error: null }));
      console.log('Starting to load metadata...');

      const response = await agent.Product.getProductMetadata(); 
      console.log('API Response:', response);

      if (response && response.data) { 
        const fetchedMetadata = response.data;
        console.log('Fetched Metadata:', fetchedMetadata);

        // Log each store update
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
          error: null
        });
        console.log('Metadata state updated:', metadata);
      } else {
        throw new Error('No data received from product metadata API');
      }
    } catch (error) {
      console.error('Error loading metadata:', error);
      setMetadata((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to load metadata",
      }));
    }
  };

  useEffect(() => {
    loadMetadata();
  }, []);

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
