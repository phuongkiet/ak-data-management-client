import { action, makeObservable, observable, runInAction } from 'mobx'
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
      waterAbsorptionForm: observable,
      waterAbsorptionFormUpdate: observable,
      setProductWaterAbsorptionList: action,
      setTerm: action,
      searchWaterAbsorption: action,
      loadWaterAbsorption: action,
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

  setTerm = (term: string) => {
    this.term = term;
    // Không tự động gọi search nữa, chỉ lưu term
  }

  // Method riêng để thực hiện search khi bấm nút tìm kiếm
  searchWaterAbsorption = async () => {
    await this.loadWaterAbsorption(this.term);
  }

  loadWaterAbsorption = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductWaterAbsorption.waterAbsorptionList(term);
      runInAction(() => {
        this.productWaterAbsorptionList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productWaterAbsorptionRegistry.clear();
        this.productWaterAbsorptionList.forEach(waterAbsorption => {
          if (waterAbsorption.id != null) this.productWaterAbsorptionRegistry.set(waterAbsorption.id, waterAbsorption);
        });

        // Update metadata in localStorage
        this.updateMetadataInLocalStorage(this.productWaterAbsorptionList);
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
        
        // Tạo item mới từ form data và thêm vào metadata
        const newItem: ProductWaterAbsorptionDto = {
          id: Date.now(), // Temporary ID, sẽ được cập nhật khi reload
          waterAbsoprtionLevel: this.waterAbsorptionForm.waterAbsoprtionLevel
        };
        this.addItemToMetadata(newItem);
        
        // Reload data để lấy ID thực từ server
        await this.loadWaterAbsorption();
        this.resetWaterAbsorptionForm();
        this.loading = false;
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
    }
  }

  updateWaterAbsorption = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductWaterAbsorption.updateWaterAbsorption(id, this.waterAbsorptionFormUpdate);
      if (result.success) {
        toast.success("Cập nhật độ hút nước thành công.");
        
        // Cập nhật item trong metadata với form data
        const updatedItem: ProductWaterAbsorptionDto = {
          id: id,
          waterAbsoprtionLevel: this.waterAbsorptionFormUpdate.waterAbsoprtionLevel
        };
        this.addItemToMetadata(updatedItem);
        
        // Reload data để đảm bảo đồng bộ
        await this.loadWaterAbsorption();
        this.resetWaterAbsorptionForm();
        this.loading = false;
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
        
        // Xóa item khỏi metadata
        this.removeItemFromMetadata(id);
        
        this.loadWaterAbsorption();
        this.loading = false;
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
}