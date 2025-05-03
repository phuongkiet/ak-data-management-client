import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { ProductSurfaceDto } from '../models/product/productSurface.model.ts'

export default class SurfaceStore {
  productSurfaceList: ProductSurfaceDto[] = [];
  productSurfaceRegistry = new Map<number, ProductSurfaceDto>();
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadSurfaces = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductSurface.surfaceList();
      console.log(result);
      runInAction(() => {
        this.productSurfaceList = result.data || [];
        this.loading = false;

        // Optionally: store surfaces in a Map
        this.productSurfaceRegistry.clear();
        this.productSurfaceList.forEach(surface => {
          if (surface.id != null) this.productSurfaceRegistry.set(surface.id, surface);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load surface", error);
      toast.error("Lỗi khi tải dữ liệu bề mặt.")
    }
  };
}