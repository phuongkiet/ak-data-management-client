import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { ProductStorageDto } from '../models/product/productStorage.model.ts'

export default class StorageStore {
  productStorageList: ProductStorageDto[] = [];
  productStorageRegistry = new Map<number, ProductStorageDto>();
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadStorages = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductStorage.storageList();
      console.log(result);
      runInAction(() => {
        this.productStorageList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productStorageRegistry.clear();
        this.productStorageList.forEach(storage => {
          if (storage.id != null) this.productStorageRegistry.set(storage.id, storage);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load storage", error);
      toast.error("Lỗi khi tải dữ liệu kho.")
    }
  };
}