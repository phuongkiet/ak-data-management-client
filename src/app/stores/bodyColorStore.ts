import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { ProductBodyColorDto } from '../models/product/productBodyColor.model.ts'

export default class BodyColorStore {
  productBodyColorList: ProductBodyColorDto[] = [];
  productBodyColorRegistry = new Map<number, ProductBodyColorDto>();
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadBodyColors = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductBodyColor.bodyColorList();
      console.log(result);
      runInAction(() => {
        this.productBodyColorList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productBodyColorRegistry.clear();
        this.productBodyColorList.forEach(bodyColor => {
          if (bodyColor.id != null) this.productBodyColorRegistry.set(bodyColor.id, bodyColor);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load body color", error);
      toast.error("Lỗi khi tải dữ liệu màu sắc thân gạch.")
    }
  };
}