import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent.ts";
import { toast } from "react-toastify";
import {
  AddStorageDto,
  ProductStorageDto,
} from "../models/product/productStorage.model.ts";

export default class StorageStore {
  productStorageList: ProductStorageDto[] = [];
  productStorageRegistry = new Map<number, ProductStorageDto>();
  loading = false;

  storageForm: AddStorageDto = {
    name: "",
  };

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
      console.log(result);
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
}
