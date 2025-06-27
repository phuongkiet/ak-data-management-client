import { action, makeObservable, observable, runInAction, computed } from "mobx";
import agent from "../api/agent.ts";
import { toast } from "react-toastify";
import {
  AddAntiSlipperyDto,
  ProductAntiSlipperyDto,
  UpdateAntiSlipperyDto,
} from "../models/product/productAntiSlippery.model.ts";
import BaseStore from "./baseStore.ts";
import { OfflineStorage } from "../services/offlineStorage.ts";

export default class AntiSlipperyStore extends BaseStore {
  productAntiSlipperyList: ProductAntiSlipperyDto[] = [];
  productAntiSlipperyRegistry = new Map<number, ProductAntiSlipperyDto>();
  tempList: ProductAntiSlipperyDto[] = [];
  loading = false;
  term: string = "";

  antiSlipperyForm: AddAntiSlipperyDto = {
    antiSlipLevel: "",
    description: null,
  };

  antiSlipperyFormUpdate: UpdateAntiSlipperyDto = {
    antiSlipLevel: "",
    description: null,
  };

  constructor() {
    super();
    makeObservable(this, {
      productAntiSlipperyList: observable,
      productAntiSlipperyRegistry: observable,
      tempList: observable,
      loading: observable,
      term: observable,
      antiSlipperyForm: observable,
      antiSlipperyFormUpdate: observable,
      displayList: computed,
      setProductAntiSlipperyList: action,
      setTerm: action,
      loadAntiSlipperys: action,
      resetAntiSlipperyForm: action,
      updateAntiSlipperyForm: action,
      addAntiSlippery: action,
      updateAntiSlippery: action,
      updateAntiSlipperyFormUpdate: action,
      deleteAntiSlippery: action,
    });
  }

  setProductAntiSlipperyList = (list: ProductAntiSlipperyDto[]) => {
    this.productAntiSlipperyList = list;
    this.productAntiSlipperyRegistry.clear();
    list.forEach((antiSlippery) => {
      if (antiSlippery.id != null)
        this.productAntiSlipperyRegistry.set(antiSlippery.id, antiSlippery);
    });

    this.updateMetadataInLocalStorage(list);
  };

  setTerm = (term: string) => {
    this.term = term;
    // Không tự động gọi search nữa, chỉ lưu term
  };

  searchAntiSlippery = async () => {
    await this.loadAntiSlipperys(this.term);
  }

  loadAntiSlipperys = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.AntiSlippery.antiSlipperyList(term);
      runInAction(() => {
        if (term) {
          // Nếu có term (search), lưu vào tempList
          this.tempList = result.data || [];
        } else {
          // Nếu không có term, load toàn bộ vào productAntiSlipperyList
          this.productAntiSlipperyList = result.data || [];
          // Cập nhật registry
          this.productAntiSlipperyRegistry.clear();
          this.productAntiSlipperyList.forEach((antiSlippery) => {
            if (antiSlippery.id != null)
              this.productAntiSlipperyRegistry.set(antiSlippery.id, antiSlippery);
          });
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load anti slippery", error);
      toast.error("Lỗi khi tải dữ liệu độ chống trươt.");
    }
  };

  loadAllAntiSlipperys = async () => {
    await this.loadAntiSlipperys();
  }

  clearSearch = () => {
    this.term = "";
    this.tempList = [];
  }

  updateAntiSlipperyForm = <K extends keyof AddAntiSlipperyDto>(
    field: K,
    value: AddAntiSlipperyDto[K]
  ) => {
    runInAction(() => {
      this.antiSlipperyForm[field] = value;
    });
  };

  resetAntiSlipperyForm = () => {
    this.antiSlipperyForm = {
      antiSlipLevel: "",
      description: null,
    };
  };

  addAntiSlippery = async () => {
    this.loading = true;
    try {
      const result = await agent.AntiSlippery.addAntiSlippery(
        this.antiSlipperyForm
      );
      if (result.success) {
        toast.success("Thêm độ chống trươt thành công.");
        this.loadAllAntiSlipperys(); // Reload toàn bộ list
        this.resetAntiSlipperyForm();
        this.loading = false;
        const newItem: ProductAntiSlipperyDto = {
          id: Date.now(),
          antiSlipLevel: this.antiSlipperyForm.antiSlipLevel,
          description: this.antiSlipperyForm.description,
        };
        this.addItemToMetadata(newItem);
        return true;
      } else {
        toast.error("Lỗi khi thêm độ chống trươt.");
        this.loading = false;
        return false;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateAntiSlippery = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.AntiSlippery.updateAntiSlippery(
        id,
        this.antiSlipperyFormUpdate
      );
      if (result.success) {
        toast.success("Cập nhật độ chống trươt thành công.");
        this.loadAllAntiSlipperys(); // Reload toàn bộ list
        this.resetAntiSlipperyForm();
        const updatedItem: ProductAntiSlipperyDto = {
          id: id,
          antiSlipLevel: this.antiSlipperyFormUpdate.antiSlipLevel,
          description: this.antiSlipperyFormUpdate.description,
        };
        this.addItemToMetadata(updatedItem);
        this.loading = false;
        return true;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateAntiSlipperyFormUpdate = <K extends keyof UpdateAntiSlipperyDto>(
    field: K,
    value: UpdateAntiSlipperyDto[K]
  ) => {
    runInAction(() => {
      this.antiSlipperyFormUpdate = {
        ...this.antiSlipperyFormUpdate,
        [field]: value,
      };
    });
  };

  deleteAntiSlippery = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.AntiSlippery.deleteAntiSlippery(id);
      if (result.success) {
        toast.success(result.data);
        this.loadAllAntiSlipperys(); // Reload toàn bộ list
        this.loading = false;
        this.removeItemFromMetadata(id);
        return true;
      } else {
        toast.error(result.errors[0]);
        this.loading = false;
        return false;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  private updateMetadataInLocalStorage = (antiSlipperyList: ProductAntiSlipperyDto[]) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productAntiSlipperyDtos = antiSlipperyList;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }
  private removeItemFromMetadata = (id: number) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productAntiSlipperyDtos = currentMetadata.productAntiSlipperyDtos.filter(item => item.id !== id);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }
  private addItemToMetadata = (newItem: ProductAntiSlipperyDto) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productAntiSlipperyDtos.push(newItem);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  get displayList() {
    return this.term ? this.tempList : this.productAntiSlipperyList;
  }
}
