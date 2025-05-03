import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { ProductOriginDto } from '../models/product/productOrigin.model.ts'

export default class OriginStore {
  productOriginList: ProductOriginDto[] = [];
  productOriginRegistry = new Map<number, ProductOriginDto>();
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadOrigins = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductOrigin.originList();
      console.log(result);
      runInAction(() => {
        this.productOriginList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productOriginRegistry.clear();
        this.productOriginList.forEach(origin => {
          if (origin.id != null) this.productOriginRegistry.set(origin.id, origin);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load origin", error);
      toast.error("Lỗi khi tải dữ liệu xuất xứ.")
    }
  };
}