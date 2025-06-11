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
      loadWaterAbsorption: action,
      resetWaterAbsorptionForm: action,
      updateWaterAbsorptionForm: action,
      addWaterAbsorption: action,
      updateWaterAbsorption: action,
      updateWaterAbsorptionFormUpdate: action,
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
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.waterAbsoroptionDtos = list;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  setTerm = (term: string) => {
    this.term = term;
    this.loadWaterAbsorption(this.term);
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
      console.log(result);
      if (result.success) {
        toast.success("Thêm độ hút nước thành công.");
        this.loadWaterAbsorption();
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
        this.loadWaterAbsorption();
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
}