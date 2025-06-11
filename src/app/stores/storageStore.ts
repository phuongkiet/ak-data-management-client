import { action, makeObservable, observable, runInAction } from "mobx";
import agent from "../api/agent.ts";
import { toast } from "react-toastify";
import {
  AddStorageDto,
  ProductStorageDto,
  UpdateStorageDto,
} from "../models/product/productStorage.model.ts";
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class StorageStore extends BaseStore {
  productStorageList: ProductStorageDto[] = [];
  productStorageRegistry = new Map<number, ProductStorageDto>();
  loading = false;
  term: string = '';

  storageForm: AddStorageDto = {
    name: "",
  };

  storageFormUpdate: UpdateStorageDto = {
    name: "",
  };

  constructor() {
    super();
    makeObservable(this, {
      productStorageList: observable,
      productStorageRegistry: observable,
      loading: observable,
      term: observable,
      storageForm: observable,
      storageFormUpdate: observable,
      setProductStorageList: action,
      setTerm: action,
      loadStorages: action,
      resetStorageForm: action,
      updateStorageForm: action,
      addStorage: action,
      updateStorage: action,
      updateStorageFormUpdate: action,
    });
  }

  setProductStorageList = (list: ProductStorageDto[]) => {
    this.productStorageList = list;
    this.productStorageRegistry.clear();
    list.forEach((storage) => {
      if (storage.id != null)
        this.productStorageRegistry.set(storage.id, storage);
    });
    // Update metadata in localStorage
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productStorageDtos = list;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  setTerm = (term: string) => {
    this.term = term;
    this.loadStorages(this.term);
  }

  loadStorages = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductStorage.storageList(term);
      console.log(result);
      runInAction(() => {
        this.productStorageList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productStorageRegistry.clear();
        this.productStorageList.forEach((storage) => {
          if (storage.id != null)
            this.productStorageRegistry.set(storage.id, storage);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load storage", error);
      toast.error("Lỗi khi tải dữ liệu kho.");
    }
  };

  updateStorageForm = <K extends keyof AddStorageDto>(
    field: K,
    value: AddStorageDto[K]
  ) => {
    runInAction(() => {
      this.storageForm[field] = value;
    });
  };

  resetStorageForm = () => {
    this.storageForm = {
      name: "",
    };
  };

  addStorage = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductStorage.addStorage(this.storageForm);
      if (result.success) {
        toast.success("Thêm kho thành công.");
        this.loadStorages();
        this.resetStorageForm();
        this.loading = false;
        return true;
      } else {
        toast.error("Lỗi khi thêm kho.");
        this.loading = false;
        return false;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to add product storage", error);
      toast.error("Lỗi khi thêm kho.");
    }
  };

  updateStorage = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductStorage.updateStorage(id, this.storageFormUpdate);
      if (result.success) {
        toast.success("Cập nhật kho thành công.");
        this.loadStorages();
        this.resetStorageForm();
        this.loading = false;
        return true;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateStorageFormUpdate = <K extends keyof UpdateStorageDto>(field: K, value: UpdateStorageDto[K]) => {
    runInAction(() => {
      this.storageFormUpdate = {
        ...this.storageFormUpdate,
        [field]: value
      };
    });
  }
}
