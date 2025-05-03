import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { ProductSizeDto } from '../models/product/productSize.model.ts'

export default class SizeStore {
  productSizeList: ProductSizeDto[] = [];
  productSizeRegistry = new Map<number, ProductSizeDto>();
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadSizes = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductSize.sizeList();
      console.log(result);
      runInAction(() => {
        this.productSizeList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productSizeRegistry.clear();
        this.productSizeList.forEach(size => {
          if (size.id != null) this.productSizeRegistry.set(size.id, size);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load size", error);
      toast.error("Lỗi khi tải dữ liệu kích thước.")
    }
  };
}