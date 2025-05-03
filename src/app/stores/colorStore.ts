import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { ProductColorDto } from '../models/product/productColor.model.ts'

export default class ColorStore {
  productColorList: ProductColorDto[] = [];
  productColorRegistry = new Map<number, ProductColorDto>();
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadColors = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductColor.colorList();
      console.log(result);
      runInAction(() => {
        this.productColorList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productColorRegistry.clear();
        this.productColorList.forEach(color => {
          if (color.id != null) this.productColorRegistry.set(color.id, color);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load color", error);
      toast.error("Lỗi khi tải dữ liệu màu sắc.")
    }
  };
}