import { action, makeObservable, observable, runInAction, computed } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddFactoryDto, ProductFactoryDto, UpdateFactoryDto } from '../models/product/productFactory.model.ts';
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class FactoryStore extends BaseStore {
  productFactoryList: ProductFactoryDto[] = [];
  productFactoryRegistry = new Map<number, ProductFactoryDto>();
  tempList: ProductFactoryDto[] = [];
  loading = false;
  term: string = '';

  get displayList() {
    return this.term ? this.tempList : this.productFactoryList;
  }

  factoryForm: AddFactoryDto = {
    name: '',
  };

  factoryFormUpdate: UpdateFactoryDto = {
    name: '',
  };

  constructor() {
    super();
    makeObservable(this, {
      productFactoryList: observable,
      productFactoryRegistry: observable,
      tempList: observable,
      displayList: computed,
      loading: observable,
      term: observable,
      factoryForm: observable,
      factoryFormUpdate: observable,
      setProductFactoryList: action,
      setTerm: action,
      loadFactories: action,
      resetFactoryForm: action,
      updateFactoryForm: action,
      addFactory: action,
      updateFactory: action,
      updateFactoryFormUpdate: action,
      deleteFactory: action,
    });
  }

  setProductFactoryList = (list: ProductFactoryDto[]) => {
    this.productFactoryList = list;
    this.productFactoryRegistry.clear();
    list.forEach((factory) => {
      if (factory.id != null)
        this.productFactoryRegistry.set(factory.id, factory);
    });
    // Update metadata in localStorage
    this.updateMetadataInLocalStorage(list);
  }

  setTerm = (term: string) => {
    this.term = term;
  }

  searchFactory = async () => {
    await this.loadFactories(this.term);
  }

  loadAllFactories = async () => {
    await this.loadFactories();
  }

  clearSearch = () => {
    this.term = "";
    this.tempList = [];
  }

  loadFactories = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductFactory.factoryList(term);
      runInAction(() => {
        if (term) {
          // Nếu có term (search), lưu vào tempList
          this.tempList = result.data || [];
        } else {
          // Nếu không có term, load toàn bộ vào productFactoryList
          this.productFactoryList = result.data || [];
          // Cập nhật registry
          this.productFactoryRegistry.clear();
          this.productFactoryList.forEach((factory) => {
            if (factory.id != null) this.productFactoryRegistry.set(factory.id, factory);
          });
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load factory", error);
      toast.error("Lỗi khi tải dữ liệu nhà máy.")
    }
  };

  getFactoriesBySupplier = async (supplierId: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductFactory.getFactoriesBySupplier(supplierId);
      runInAction(() => {
        this.productFactoryList = result.data || [];
        this.loading = false;

        // Store factories in a Map
        this.productFactoryRegistry.clear();
        this.productFactoryList.forEach(factory => {
          if (factory.id != null) this.productFactoryRegistry.set(factory.id, factory);
        });
      });
      return result.data || [];
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load factories by supplier", error);
      toast.error("Lỗi khi tải dữ liệu nhà máy theo nhà cung cấp.")
      return [];
    }
  };

  updateFactoryForm = <K extends keyof AddFactoryDto>(field: K, value: AddFactoryDto[K]) => {
    runInAction(() => {
      this.factoryForm[field] = value;
    });
  };

  resetFactoryForm = () => {
    runInAction(() => {
      this.factoryForm = {
        name: '',
      };
    });
  };

  addFactory = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductFactory.addFactory(this.factoryForm);
      if (result.success) {
        toast.success("Nhà máy đã được tạo thành công.");
        this.loading = false;
        this.factoryForm.name = '';
        this.loadFactories();
        const newItem: ProductFactoryDto = {
          id: Date.now(),
          name: this.factoryForm.name,
        };
        this.addItemToMetadata(newItem);
        return true;
      }
      return false;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to add factory", error);
      toast.error("Lỗi khi tạo nhà máy.")
    }
  }

  updateFactory = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductFactory.updateFactory(id, this.factoryFormUpdate);
      if (result.success) {
        toast.success("Cập nhật nhà máy thành công.");
        this.loadAllFactories();
        this.resetFactoryForm();
        this.loading = false;
        const updatedItem: ProductFactoryDto = {
          id: id,
          name: this.factoryFormUpdate.name,
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

  updateFactoryFormUpdate = <K extends keyof UpdateFactoryDto>(field: K, value: UpdateFactoryDto[K]) => {
    runInAction(() => {
      this.factoryFormUpdate = {
        ...this.factoryFormUpdate,
        [field]: value
      };
    });
  }

  deleteFactory = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductFactory.deleteFactory(id);
      if (result.success) {
        toast.success(result.data);
        this.loadAllFactories();
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

  private updateMetadataInLocalStorage = (factoryList: ProductFactoryDto[]) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productFactoryDtos = factoryList;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private addItemToMetadata = (newItem: ProductFactoryDto) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productFactoryDtos.push(newItem);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private removeItemFromMetadata = (id: number) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productFactoryDtos = currentMetadata.productFactoryDtos.filter(
        item => item.id !== id
      );
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }
}