import { action, makeObservable, observable, runInAction, computed } from "mobx";
import agent from "../api/agent.ts";
import { toast } from "react-toastify";
import {
  AddBodyColorDto,
  ProductBodyColorDto,
  UpdateBodyColorDto,
} from "../models/product/productBodyColor.model.ts";
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class BodyColorStore extends BaseStore {
  productBodyColorList: ProductBodyColorDto[] = [];
  productBodyColorRegistry = new Map<number, ProductBodyColorDto>();
  tempList: ProductBodyColorDto[] = [];
  loading = false;
  term: string = '';

  get displayList() {
    return this.term ? this.tempList : this.productBodyColorList;
  }

  bodyColorForm: AddBodyColorDto = {
    name: "",
  };

  bodyColorFormUpdate: UpdateBodyColorDto = {
    name: "",
  };

  constructor() {
    super();
    makeObservable(this, {
      productBodyColorList: observable,
      productBodyColorRegistry: observable,
      tempList: observable,
      loading: observable,
      term: observable,
      bodyColorForm: observable,
      bodyColorFormUpdate: observable,
      displayList: computed,
      setProductBodyColorList: action,
      setTerm: action,
      loadBodyColors: action,
      resetBodyColorForm: action,
      updateBodyColorForm: action,
      addBodyColor: action,
      updateBodyColor: action,
      updateBodyColorFormUpdate: action,
      deleteBodyColor: action,
    });
  }

  setProductBodyColorList = (list: ProductBodyColorDto[]) => {
    this.productBodyColorList = list;
    this.productBodyColorRegistry.clear();
    list.forEach((bodyColor) => {
      if (bodyColor.id != null)
        this.productBodyColorRegistry.set(bodyColor.id, bodyColor);
    });

    this.updateMetadataInLocalStorage(list);
  }

  setTerm = (term: string) => {
    this.term = term;
    // Không tự động gọi search nữa, chỉ lưu term
  }

  searchBodyColor = async () => {
    await this.loadBodyColors(this.term);
  }

  loadAllBodyColors = async () => {
    await this.loadBodyColors();
  }

  clearSearch = () => {
    this.term = "";
    this.tempList = [];
  }

  loadBodyColors = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductBodyColor.bodyColorList(term);
      runInAction(() => {
        if (term) {
          // Nếu có term (search), lưu vào tempList
          this.tempList = result.data || [];
        } else {
          // Nếu không có term, load toàn bộ vào productBodyColorList
          this.productBodyColorList = result.data || [];
          // Cập nhật registry
          this.productBodyColorRegistry.clear();
          this.productBodyColorList.forEach((bodyColor) => {
            if (bodyColor.id != null)
              this.productBodyColorRegistry.set(bodyColor.id, bodyColor);
          });
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load body color", error);
      toast.error("Lỗi khi tải dữ liệu màu sắc thân gạch.");
    }
  };

  resetBodyColorForm = () => {
    this.bodyColorForm = {
      name: "",
    };
  };

  updateBodyColorForm = <K extends keyof AddBodyColorDto>(field: K, value: AddBodyColorDto[K]) => {
    runInAction(() => {
      this.bodyColorForm[field] = value;
    });
  };

  addBodyColor = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductBodyColor.addBodyColor(
        this.bodyColorForm
      );
      if (result.success) {
        toast.success("Thêm màu sắc thân gạch thành công.");
        this.loadAllBodyColors();
        this.resetBodyColorForm();
        const newItem: ProductBodyColorDto = {
          id: Date.now(),
          name: this.bodyColorForm.name,
        };
        this.addItemToMetadata(newItem);
        this.loading = false;
        return true;
      } else {
        toast.error("Lỗi khi thêm màu sắc thân gạch.");
        this.loading = false;
        return false;
      }
    } catch (error) {
      console.error("Failed to add color", error);
      toast.error("Lỗi khi thêm màu sắc thân gạch.");
    } finally {
      this.loading = false;
    }
  };

  updateBodyColor = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductBodyColor.updateBodyColor(id, this.bodyColorFormUpdate);
      if (result.success) {
        toast.success("Cập nhật màu sắc thân gạch thành công.");
        this.loadAllBodyColors();
        this.resetBodyColorForm();
        const newItem: ProductBodyColorDto = {
          id: Date.now(),
          name: this.bodyColorForm.name,
        };
        this.addItemToMetadata(newItem);
        this.loading = false;
        return true;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateBodyColorFormUpdate = <K extends keyof UpdateBodyColorDto>(field: K, value: UpdateBodyColorDto[K]) => {
    runInAction(() => {
      this.bodyColorFormUpdate = {
        ...this.bodyColorFormUpdate,
        [field]: value
      };
    });
  }

  deleteBodyColor = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductBodyColor.deleteBodyColor(id);
      if (result.success) {
        toast.success(result.data);
        this.loadAllBodyColors();
        this.removeItemFromMetadata(id);
        this.loading = false;
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

  private updateMetadataInLocalStorage = (bodyColorList: ProductBodyColorDto[]) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productBodyColorDtos = bodyColorList;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private removeItemFromMetadata = (id: number) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productBodyColorDtos = currentMetadata.productBodyColorDtos.filter(item => item.id !== id);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  } 

  private addItemToMetadata = (newItem: ProductBodyColorDto) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productBodyColorDtos.push(newItem);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }
}
