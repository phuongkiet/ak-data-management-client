import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddAntiSlipperyDto, ProductAntiSlipperyDto } from '../models/product/productAntiSlippery.model.ts'

export default class AntiSlipperyStore {
  productAntiSlipperyList: ProductAntiSlipperyDto[] = [];
  productAntiSlipperyRegistry = new Map<number, ProductAntiSlipperyDto>();
  loading = false;

  antiSlipperyForm: AddAntiSlipperyDto = {
    antiSlipLevel: "",
    description: null
  }

  constructor() {
    makeAutoObservable(this);
  }

  loadAntiSlipperys = async () => {
    this.loading = true;
    try {
      const result = await agent.AntiSlippery.antiSlipperyList();
      console.log(result);
      runInAction(() => {
        this.productAntiSlipperyList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productAntiSlipperyRegistry.clear();
        this.productAntiSlipperyList.forEach(antiSlippery => {
          if (antiSlippery.id != null) this.productAntiSlipperyRegistry.set(antiSlippery.id, antiSlippery);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load anti slippery", error);
      toast.error("Lỗi khi tải dữ liệu độ chống trươt.")
    }
  };

  updateAntiSlipperyForm = <K extends keyof AddAntiSlipperyDto>(field: K, value: AddAntiSlipperyDto[K]) => {
    runInAction(() => {
      this.antiSlipperyForm[field] = value;
    });
  }

  resetAntiSlipperyForm = () => {
    this.antiSlipperyForm = {
      antiSlipLevel: "",
      description: null
    };
  }

  addAntiSlippery = async () => {
    this.loading = true;
    try {
      const result = await agent.AntiSlippery.addAntiSlippery(this.antiSlipperyForm);
      console.log(result);
      if (result.success) {
        toast.success("Thêm độ chống trươt thành công.");
        this.loadAntiSlipperys();
        this.resetAntiSlipperyForm();
        this.loading = false;
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
  }
}