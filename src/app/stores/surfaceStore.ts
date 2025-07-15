import { action, computed,  makeObservable, observable, runInAction } from 'mobx'
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
  tempList: ProductSurfaceDto[] = [];

  get displayList() {
    return this.term ? this.tempList : this.productSurfaceList;
  }

  surfaceForm: AddSurfaceDto = {
    name: "",
    shortCode: "",
    description: null,
  };

  surfaceFormUpdate: UpdateSurfaceDto = {
    name: "",
    shortCode: "",
    description: null,
  };

  constructor() {
    super();
    makeObservable(this, {
      productSurfaceList: observable,
      productSurfaceRegistry: observable,
      tempList: observable,
      displayList: computed,
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
      deleteSurface: action,
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
    this.updateMetadataInLocalStorage(list);
  }

  resetSurfaceForm = () => {
    this.surfaceForm = {
      name: "",
      shortCode: "",
      description: null,
    };
  };

  setTerm = (term: string) => {
    this.term = term;
  }

  searchSurface = async () => {
    await this.loadSurfaces(this.term);
  }

  loadAllSurfaces = async () => {
    await this.loadSurfaces();
  }

  clearSearch = () => {
    this.term = "";
    this.tempList = [];
  }

  loadSurfaces = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductSurface.surfaceList(term);
      runInAction(() => {
        if (term) {
          // Nếu có term (search), lưu vào tempList
          this.tempList = result.data || [];
        } else {
          // Nếu không có term, load toàn bộ vào productSurfaceList
          this.productSurfaceList = result.data || [];
          // Cập nhật registry
          this.productSurfaceRegistry.clear();
          this.productSurfaceList.forEach(surface => {
            if (surface.id != null) this.productSurfaceRegistry.set(surface.id, surface);
          });
        }
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
      if (result.success) {
        toast.success("Bề mặt đã được tạo thành công.");
        this.loading = false;
        this.resetSurfaceForm();
        this.loadSurfaces();
        const newItem: ProductSurfaceDto = {
          id: Date.now(),
          name: this.surfaceForm.name,
          shortCode: this.surfaceForm.shortCode,
          description: this.surfaceForm.description
        };
        this.addItemToMetadata(newItem);
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
        this.loadAllSurfaces(); // Reload toàn bộ list
        this.resetSurfaceForm();
        this.loading = false;
        // Cập nhật item trong metadata với form data
        const updatedItem: ProductSurfaceDto = {
          id: id,
          name: this.surfaceFormUpdate.name,
          shortCode: this.surfaceFormUpdate.shortCode,
          description: this.surfaceFormUpdate.description
        };
        this.addItemToMetadata(updatedItem);
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

  deleteSurface = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductSurface.deleteSurface(id);
      if (result.success) {
        toast.success(result.data);
        this.loadAllSurfaces(); // Reload toàn bộ list
        this.loading = false;
        this.removeItemFromMetadata(id);
        return true;
      } else {
        toast.error(result.errors[0]);
        this.loading = false;
        return false;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  private updateMetadataInLocalStorage = (surfaceList: ProductSurfaceDto[]) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productSurfaceDtos = surfaceList;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private addItemToMetadata = (newItem: ProductSurfaceDto) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productSurfaceDtos.push(newItem);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private removeItemFromMetadata = (id: number) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productSurfaceDtos = currentMetadata.productSurfaceDtos.filter(
        item => item.id !== id
      );
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }
}