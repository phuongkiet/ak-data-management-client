import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddSurfaceDto, ProductSurfaceDto } from '../models/product/productSurface.model.ts'

export default class SurfaceStore {
  productSurfaceList: ProductSurfaceDto[] = [];
  productSurfaceRegistry = new Map<number, ProductSurfaceDto>();
  loading = false;
  term: string = '';

  surfaceForm: AddSurfaceDto = {
    name: "",
    description: null,
  };

  constructor() {
    makeAutoObservable(this);
  }

  resetSurfaceForm = () => {
    this.surfaceForm = {
      name: "",
      description: null,
    };
  };

  setTerm = (term: string) => {
    this.term = term;
    this.loadSurfaces(this.term);
  }

  loadSurfaces = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductSurface.surfaceList(term);
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

  updateSurfaceForm = (key: keyof AddSurfaceDto, value: string) => {
    this.surfaceForm[key] = value;
  };

  addSurface = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductSurface.addSurface(this.surfaceForm);
      console.log(result);
      if (result.success) {
        toast.success("Bề mặt đã được tạo thành công.");
        this.loading = false;
        this.resetSurfaceForm();
        this.loadSurfaces();
        return true;
      }else{
        toast.error("Lỗi khi tạo bề mặt.");
        this.loading = false;
        return false;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to add surface", error);
      toast.error("Lỗi khi tạo bề mặt.");
    }
  }
}