import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddWaterAbsorptionDto, ProductWaterAbsorptionDto, UpdateWaterAbsorptionDto } from '../models/product/productWaterAbsorption.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class WaterAbsorptionStore extends BaseStore {
  productWaterAbsorptionList: ProductWaterAbsorptionDto[] = [];
  productWaterAbsorptionRegistry = new Map<number, ProductWaterAbsorptionDto>();
  loading = false;
  term: string = '';
  tempList: ProductWaterAbsorptionDto[] = [];

  get displayList() {
    return this.term ? this.tempList : this.productWaterAbsorptionList;
  }

  waterAbsorptionForm: AddWaterAbsorptionDto = {
    waterAbsoprtionLevel: ""
  }

  waterAbsorptionFormUpdate: UpdateWaterAbsorptionDto = {
    waterAbsoprtionLevel: ""
  }

  constructor() {
    super();
    makeObservable(this, {
      productWaterAbsorptionList: observable,
      productWaterAbsorptionRegistry: observable,
      loading: observable,
      term: observable,
      tempList: observable,
      displayList: computed,
      waterAbsorptionForm: observable,
      waterAbsorptionFormUpdate: observable,
      setProductWaterAbsorptionList: action,
      setTerm: action,
      searchWaterAbsorption: action,
      loadWaterAbsorption: action,
      loadAllWaterAbsorption: action,
      clearSearch: action,
      resetWaterAbsorptionForm: action,
      updateWaterAbsorptionForm: action,
      addWaterAbsorption: action,
      updateWaterAbsorption: action,
      updateWaterAbsorptionFormUpdate: action,
      deleteWaterAbsorption: action,
    });
  }

  setProductWaterAbsorptionList = (list: ProductWaterAbsorptionDto[]) => {
    this.productWaterAbsorptionList = list;
    this.productWaterAbsorptionRegistry.clear();
    list.forEach((waterAbsorption) => {
      if (waterAbsorption.id != null)
        this.productWaterAbsorptionRegistry.set(waterAbsorption.id, waterAbsorption);
    });
    // Update metadata in localStorage
    this.updateMetadataInLocalStorage(list);
  }

  setTerm = (term: string) => {
    this.term = term;
  }

  searchWaterAbsorption = async () => {
    await this.loadWaterAbsorption(this.term);
  }

  loadAllWaterAbsorption = async () => {
    await this.loadWaterAbsorption();
  }

  clearSearch = () => {
    this.term = "";
    this.tempList = [];
  }

  loadWaterAbsorption = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductWaterAbsorption.waterAbsorptionList(term);
      runInAction(() => {
        if (term) {
          // Nếu có term (search), lưu vào tempList
          this.tempList = result.data || [];
        } else {
          // Nếu không có term, load toàn bộ vào productWaterAbsorptionList
          this.productWaterAbsorptionList = result.data || [];
          // Cập nhật registry
          this.productWaterAbsorptionRegistry.clear();
          this.productWaterAbsorptionList.forEach(waterAbsorption => {
            if (waterAbsorption.id != null) this.productWaterAbsorptionRegistry.set(waterAbsorption.id, waterAbsorption);
          });
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load water absorption", error);
      toast.error("Lỗi khi tải dữ liệu độ hút nước.")
    }
  };

  updateWaterAbsorptionForm = <K extends keyof AddWaterAbsorptionDto>(field: K, value: AddWaterAbsorptionDto[K]) => {
    runInAction(() => {
      this.waterAbsorptionForm[field] = value;
    });
  }

  resetWaterAbsorptionForm = () => {
    this.waterAbsorptionForm = {
      waterAbsoprtionLevel: ""
    };
  }

  addWaterAbsorption = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductWaterAbsorption.addWaterAbsorption(this.waterAbsorptionForm);
      if (result.success) {
        toast.success("Thêm độ hút nước thành công.");
        this.loadAllWaterAbsorption(); // Reload toàn bộ list
        this.resetWaterAbsorptionForm();
        this.loading = false;
        const newItem: ProductWaterAbsorptionDto = {
          id: Date.now(),
          waterAbsoprtionLevel: this.waterAbsorptionForm.waterAbsoprtionLevel
        };
        this.addItemToMetadata(newItem);
        return true;
      } else {
        toast.error("Lỗi khi thêm độ hút nước.");
        this.loading = false;
        return false;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to add water absorption", error);
      toast.error("Lỗi khi thêm độ hút nước.");
    }
  }

  updateWaterAbsorption = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductWaterAbsorption.updateWaterAbsorption(id, this.waterAbsorptionFormUpdate);
      if (result.success) {
        toast.success("Cập nhật độ hút nước thành công.");
        this.loadAllWaterAbsorption(); // Reload toàn bộ list
        this.resetWaterAbsorptionForm();
        this.loading = false;
        const updatedItem: ProductWaterAbsorptionDto = {
          id: id,
          waterAbsoprtionLevel: this.waterAbsorptionFormUpdate.waterAbsoprtionLevel
        };
        this.addItemToMetadata(updatedItem);
        return true;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateWaterAbsorptionFormUpdate = <K extends keyof UpdateWaterAbsorptionDto>(field: K, value: UpdateWaterAbsorptionDto[K]) => {
    runInAction(() => {
      this.waterAbsorptionFormUpdate = {
        ...this.waterAbsorptionFormUpdate,
        [field]: value
      };
    });
  }

  deleteWaterAbsorption = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductWaterAbsorption.deleteWaterAbsorption(id);
      if (result.success) {
        toast.success("Xóa độ hút nước thành công.");
        this.loadAllWaterAbsorption(); // Reload toàn bộ list
        this.loading = false;
        this.removeItemFromMetadata(id);
        return true;
      } else {
        toast.error("Lỗi khi xóa độ hút nước.");
        this.loading = false;
        return false;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // Method để cập nhật metadata trong localStorage
  private updateMetadataInLocalStorage = (waterAbsorptionList: ProductWaterAbsorptionDto[]) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.waterAbsoroptionDtos = waterAbsorptionList;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  // Method để thêm item mới vào metadata
  private addItemToMetadata = (newItem: ProductWaterAbsorptionDto) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      // Kiểm tra xem item đã tồn tại chưa
      const existingIndex = currentMetadata.waterAbsoroptionDtos.findIndex(
        item => item.id === newItem.id
      );
      
      if (existingIndex >= 0) {
        // Update existing item
        currentMetadata.waterAbsoroptionDtos[existingIndex] = newItem;
      } else {
        // Add new item
        currentMetadata.waterAbsoroptionDtos.push(newItem);
      }
      
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  // Method để xóa item khỏi metadata
  private removeItemFromMetadata = (id: number) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.waterAbsoroptionDtos = currentMetadata.waterAbsoroptionDtos.filter(
        item => item.id !== id
      );
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }
}