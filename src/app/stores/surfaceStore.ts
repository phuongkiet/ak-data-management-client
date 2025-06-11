import { action, makeObservable, observable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddSurfaceDto, ProductSurfaceDto, UpdateSurfaceDto } from '../models/product/productSurface.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class SurfaceStore extends BaseStore {
  productSurfaceList: ProductSurfaceDto[] = [];
  productSurfaceRegistry = new Map<number, ProductSurfaceDto>();
  loading = false;
  term: string = '';

  surfaceForm: AddSurfaceDto = {
    name: "",
    description: null,
  };

  surfaceFormUpdate: UpdateSurfaceDto = {
    name: "",
    description: null,
  };

  constructor() {
    super();
    makeObservable(this, {
      productSurfaceList: observable,
      productSurfaceRegistry: observable,
      loading: observable,
      term: observable,
      surfaceForm: observable,
      surfaceFormUpdate: observable,
      setProductSurfaceList: action,
      setTerm: action,
      loadSurfaces: action,
      resetSurfaceForm: action,
      updateSurfaceForm: action,
      addSurface: action,
      updateSurface: action,
      updateSurfaceFormUpdate: action,
    });
  }

  setProductSurfaceList = (list: ProductSurfaceDto[]) => {
    this.productSurfaceList = list;
    this.productSurfaceRegistry.clear();
    list.forEach((surface) => {
      if (surface.id != null)
        this.productSurfaceRegistry.set(surface.id, surface);
    });
    // Update metadata in localStorage
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productSurfaceDtos = list;
      OfflineStorage.saveMetadata(currentMetadata);
    }
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

  updateSurface = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductSurface.updateSurface(id, this.surfaceFormUpdate);
      if (result.success) {
        toast.success("Cập nhật bề mặt thành công.");
        this.loadSurfaces();
        this.resetSurfaceForm();
        this.loading = false;
        return true;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateSurfaceFormUpdate = <K extends keyof UpdateSurfaceDto>(field: K, value: UpdateSurfaceDto[K]) => {
    runInAction(() => {
      this.surfaceFormUpdate = {
        ...this.surfaceFormUpdate,
        [field]: value
      };
    });
  }
}