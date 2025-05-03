import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { ProductAntiSlipperyDto } from '../models/product/productAntiSlippery.model.ts'

export default class AntiSlipperyStore {
  productAntiSlipperyList: ProductAntiSlipperyDto[] = [];
  productAntiSlipperyRegistry = new Map<number, ProductAntiSlipperyDto>();
  loading = false;

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
}