import { OfflineStorage, PendingProduct } from './offlineStorage';
import agent from '../api/agent';

let isSyncing = false;

export const SyncService = {
  isOnline: () => navigator.onLine,

  startSync: async () => {
    if (isSyncing) return;
    isSyncing = true;
    try {
      if (!SyncService.isOnline()) return;

      const pendingProducts: PendingProduct[] = OfflineStorage.getPendingProducts();
      if (pendingProducts.length === 0) return;

      console.log('Starting sync of pending products:', pendingProducts.length);

      for (const product of pendingProducts) {
        try {
          // Call your API to create the product
          await agent.Product.addNewProduct(product.data);
          // Remove from pending queue after successful sync
          OfflineStorage.removePendingProduct(product.id);
          console.log('Successfully synced product:', product.id);
        } catch (error) {
          console.error('Failed to sync product:', product.id, error);
          // Keep the product in queue if sync fails
        }
      }
    } finally {
      isSyncing = false;
    }
  },

  // Start watching for online status
  init: () => {
    window.addEventListener('online', () => {
      console.log('Network connection restored');
      SyncService.startSync();
    });

    // Try to sync immediately if we're online
    if (SyncService.isOnline()) {
      SyncService.startSync();
    }
  }
}; 