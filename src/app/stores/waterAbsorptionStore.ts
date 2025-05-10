import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddWaterAbsorptionDto, ProductWaterAbsorptionDto } from '../models/product/productWaterAbsorption.model.ts'

export default class WaterAbsorptionStore {
  productWaterAbsorptionList: ProductWaterAbsorptionDto[] = [];
  productWaterAbsorptionRegistry = new Map<number, ProductWaterAbsorptionDto>();
  loading = false;

  waterAbsorptionForm: AddWaterAbsorptionDto = {
    waterAbsoprtionLevel: ""
  }

  constructor() {
    makeAutoObservable(this);
  }

  loadWaterAbsorption = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductWaterAbsorption.waterAbsorptionList();
      console.log(result);
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
}