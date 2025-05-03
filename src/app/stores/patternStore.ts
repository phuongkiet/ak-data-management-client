import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { ProductPatternDto } from '../models/product/productPattern.model.ts'

export default class PatternStore {
  productPatternList: ProductPatternDto[] = [];
  productPatternRegistry = new Map<number, ProductPatternDto>();
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadPatterns = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductPattern.patternList();
      console.log(result);
      runInAction(() => {
        this.productPatternList = result.data || [];
        this.loading = false;

        // Optionally: store surfaces in a Map
        this.productPatternRegistry.clear();
        this.productPatternList.forEach(pattern => {
          if (pattern.id != null) this.productPatternRegistry.set(pattern.id, pattern);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load pattern", error);
      toast.error("Lỗi khi tải dữ liệu hệ vân.")
    }
  };
}