import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddPatternDto, ProductPatternDto, UpdatePatternDto } from '../models/product/productPattern.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class PatternStore extends BaseStore {
  productPatternList: ProductPatternDto[] = [];
  productPatternRegistry = new Map<number, ProductPatternDto>();
  loading = false;
  tempList: ProductPatternDto[] = [];
  term: string = '';

  get displayList() {
    return this.term ? this.tempList : this.productPatternList;
  }

  patternForm: AddPatternDto = {
    name: '',
    shortCode: '',
    shortName: '',
    description: ''
  };

  patternFormUpdate: UpdatePatternDto = {
    name: '',
    shortCode: '',
    shortName: '',
    description: ''
  };

  constructor() {
    super();
    makeObservable(this, {
      productPatternList: observable,
      productPatternRegistry: observable,
      tempList: observable,
      loading: observable,
      term: observable,
      patternForm: observable,
      patternFormUpdate: observable,
      displayList: computed,
      setProductPatternList: action,
      setTerm: action,
      loadPatterns: action,
      resetPatternForm: action,
      updatePatternForm: action,
      addPattern: action,
      updatePattern: action,
      updatePatternFormUpdate: action,
      deletePattern: action,
    });
  }

  setProductPatternList = (list: ProductPatternDto[]) => {
    this.productPatternList = list;
    this.productPatternRegistry.clear();
    list.forEach((pattern) => {
      if (pattern.id != null)
        this.productPatternRegistry.set(pattern.id, pattern);
    });
    // Update metadata in localStorage
    this.updateMetadataInLocalStorage(list);
  }

  setTerm = (term: string) => {
    this.term = term;
  }

  searchPattern = async () => {
    await this.loadPatterns(this.term);
  }

  loadAllPatterns = async () => {
    await this.loadPatterns();
  }

  clearSearch = () => {
    this.term = "";
    this.tempList = [];
  }

  resetPatternForm = () => {
    this.patternForm = {
      name: '',
      shortCode: '',
      shortName: '',
      description: ''
    };
  };

  loadPatterns = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductPattern.patternList(term);
      runInAction(() => {
        if (term) {
          // Nếu có term (search), lưu vào tempList
          this.tempList = result.data || [];
        } else {
          // Nếu không có term, load toàn bộ vào productPatternList
          this.productPatternList = result.data || [];
          // Cập nhật registry
          this.productPatternRegistry.clear();
          this.productPatternList.forEach(pattern => {
            if (pattern.id != null) this.productPatternRegistry.set(pattern.id, pattern);
          });
        }
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

  updatePatternForm = <K extends keyof AddPatternDto>(field: K, value: AddPatternDto[K]) => {
    runInAction(() => {
      this.patternForm[field] = value;
    });
  };
  
  addPattern = async () => {
    this.loading = true;
    try {
      const response = await agent.ProductPattern.addPattern(this.patternForm);
      if (response.data) {
        toast.success(response.data);
        this.resetPatternForm();
        await this.loadAllPatterns(); // Reload toàn bộ list
        const newItem: ProductPatternDto = {
          id: Date.now(),
          name: this.patternForm.name,
          shortCode: this.patternForm.shortCode,
          shortName: this.patternForm.shortName,
          description: this.patternForm.description
        };
        this.addItemToMetadata(newItem);
        return true;
      } else {
        toast.error(response.errors?.[0] || 'Có lỗi xảy ra khi thêm hệ vân');
        return false;
      }

    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to add pattern", error);
      toast.error("Lỗi khi thêm hệ vân.")
    }
  }

  updatePattern = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductPattern.updatePattern(id, this.patternFormUpdate);
      if (result.success) {
        toast.success("Cập nhật hệ vân thành công.");
        this.loadAllPatterns(); // Reload toàn bộ list
        this.resetPatternForm();
        this.loading = false;
        const updatedItem: ProductPatternDto = {
          id: id,
          name: this.patternFormUpdate.name,
          shortCode: this.patternFormUpdate.shortCode,
          shortName: this.patternFormUpdate.shortName,
          description: this.patternFormUpdate.description
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

  updatePatternFormUpdate = <K extends keyof UpdatePatternDto>(field: K, value: UpdatePatternDto[K]) => {
    runInAction(() => {
      this.patternFormUpdate = {
        ...this.patternFormUpdate,
        [field]: value
      };
    });
  }

  deletePattern = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductPattern.deletePattern(id);
      if (result.success) {
        toast.success(result.data);
        this.loadAllPatterns(); // Reload toàn bộ list
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

  private updateMetadataInLocalStorage = (patternList: ProductPatternDto[]) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productPatternDtos = patternList;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private addItemToMetadata = (newItem: ProductPatternDto) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productPatternDtos.push(newItem);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private removeItemFromMetadata = (id: number) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productPatternDtos = currentMetadata.productPatternDtos.filter(
        item => item.id !== id
      );
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }
}