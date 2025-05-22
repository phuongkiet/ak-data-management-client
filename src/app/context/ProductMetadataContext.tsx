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
      waterAbsoroptionDtos: []
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
        console.log('Updating stores with metadata...');
        companyCodeStore.setProductCompanyCodeList(fetchedMetadata.companyCodeDtos);
        console.log('CompanyCodeDtos updated:', companyCodeStore.productCompanyCodeList);
        
        calculatedUnitStore.setProductCalculatedUnitList(fetchedMetadata.calculatedUnitDtos);
        console.log('CalculatedUnitDtos updated:', calculatedUnitStore.productCalculatedUnitList);
        
        antiSlipperyStore.setProductAntiSlipperyList(fetchedMetadata.productAntiSlipperyDtos);
        console.log('ProductAntiSlipperyDtos updated:', antiSlipperyStore.productAntiSlipperyList);
        
        areaStore.setProductAreaList(fetchedMetadata.productAreaDtos);
        console.log('ProductAreaDtos updated:', areaStore.productAreaList);
        
        bodyColorStore.setProductBodyColorList(fetchedMetadata.productBodyColorDtos);
        console.log('ProductBodyColorDtos updated:', bodyColorStore.productBodyColorList);
        
        colorStore.setProductColorList(fetchedMetadata.productColorDtos);
        console.log('ProductColorDtos updated:', colorStore.productColorList);
        
        factoryStore.setProductFactoryList(fetchedMetadata.productFactoryDtos);
        console.log('ProductFactoryDtos updated:', factoryStore.productFactoryList);
        
        materialStore.setProductMaterialList(fetchedMetadata.productMaterialDtos);
        console.log('ProductMaterialDtos updated:', materialStore.productMaterialList);
        
        originStore.setProductOriginList(fetchedMetadata.productOriginDtos);
        console.log('ProductOriginDtos updated:', originStore.productOriginList);
        
        patternStore.setProductPatternList(fetchedMetadata.productPatternDtos);
        console.log('ProductPatternDtos updated:', patternStore.productPatternList);
        
        processingStore.setProductProcessingList(fetchedMetadata.productProcessingDtos);
        console.log('ProductProcessingDtos updated:', processingStore.productProcessingList);
        
        sizeStore.setProductSizeList(fetchedMetadata.productSizeDtos);
        console.log('ProductSizeDtos updated:', sizeStore.productSizeList);
        
        storageStore.setProductStorageList(fetchedMetadata.productStorageDtos);
        console.log('ProductStorageDtos updated:', storageStore.productStorageList);
        
        supplierStore.setProductSupplierList(fetchedMetadata.productSupplierDtos);
        console.log('ProductSupplierDtos updated:', supplierStore.productSupplierList);
        
        surfaceStore.setProductSurfaceList(fetchedMetadata.productSurfaceDtos);
        console.log('ProductSurfaceDtos updated:', surfaceStore.productSurfaceList);
        
        waterAbsorptionStore.setProductWaterAbsorptionList(fetchedMetadata.waterAbsoroptionDtos);
        console.log('WaterAbsoroptionDtos updated:', waterAbsorptionStore.productWaterAbsorptionList);

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
