import { ProductMetadataDto, AddProductDto } from '../models/product/product.model';

const METADATA_STORAGE_KEY = 'product_metadata';
const PENDING_PRODUCTS_KEY = 'pending_products';

export interface PendingProduct {
  id: string;
  data: AddProductDto;
  timestamp: number;
}

export const OfflineStorage = {
  // Metadata storage
  saveMetadata: (metadata: ProductMetadataDto) => {
    localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(metadata));
  },

  getMetadata: (): ProductMetadataDto | null => {
    const metadata = localStorage.getItem(METADATA_STORAGE_KEY);
    return metadata ? JSON.parse(metadata) : null;
  },

  // Pending products queue
  addPendingProduct: (product: AddProductDto) => {
    const pendingProducts = OfflineStorage.getPendingProducts();
    const newProduct: PendingProduct = {
      id: crypto.randomUUID(),
      data: product,
      timestamp: Date.now()
    };
    pendingProducts.push(newProduct);
    localStorage.setItem(PENDING_PRODUCTS_KEY, JSON.stringify(pendingProducts));
    return newProduct.id;
  },

  getPendingProducts: (): PendingProduct[] => {
    const products = localStorage.getItem(PENDING_PRODUCTS_KEY);
    return products ? JSON.parse(products) : [];
  },

  removePendingProduct: (id: string) => {
    const pendingProducts = OfflineStorage.getPendingProducts();
    const updatedProducts = pendingProducts.filter(p => p.id !== id);
    localStorage.setItem(PENDING_PRODUCTS_KEY, JSON.stringify(updatedProducts));
  },

  clearPendingProducts: () => {
    localStorage.removeItem(PENDING_PRODUCTS_KEY);
  }
}; 