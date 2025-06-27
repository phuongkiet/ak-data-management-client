import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddSizeDto, ProductSizeDto, UpdateSizeDto } from '../models/product/productSize.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class SizeStore extends BaseStore {
  productSizeList: ProductSizeDto[] = [];
  productSizeRegistry = new Map<number, ProductSizeDto>();
  loading = false;
  tempList: ProductSizeDto[] = [];
  term: string = '';

  get displayList() {
    return this.term ? this.tempList : this.productSizeList;
  }

  sizeForm: AddSizeDto = {
    wide: 0,
    length: 0,
    autoSized: "",
    companyCodeId: null
  };

  sizeFormUpdate: UpdateSizeDto = {
    wide: 0,
    length: 0,
    autoSized: "",
    companyCodeId: null
  };

  constructor() {
    super();
    makeObservable(this, {
      productSizeList: observable,
      productSizeRegistry: observable,
      tempList: observable,
      displayList: computed,
      loading: observable,
      term: observable,
      sizeForm: observable,
      sizeFormUpdate: observable,
      setProductSizeList: action,
      setTerm: action,
      loadSizes: action,
      resetSizeForm: action,
      updateSizeForm: action,
      addSize: action,
      updateSize: action,
      updateSizeFormUpdate: action,
      deleteSize: action,
    });
  }

  setProductSizeList = (list: ProductSizeDto[]) => {
    this.productSizeList = list.map(size => ({
      id: size.id,
      wide: size.wide,
      length: size.length,
      autoSized: size.autoSized,
      companyCodeId: size.companyCodeId
    }));
    this.productSizeRegistry.clear();
    this.productSizeList.forEach((size) => {
      if (size.id != null)
        this.productSizeRegistry.set(size.id, size);
    });
    // Update metadata in localStorage
    this.updateMetadataInLocalStorage(list);
  } 

  setTerm = (term: string) => {
    this.term = term;
  }

  searchSize = async () => {
    await this.loadSizes(this.term);
  }

  loadAllSizes = async () => {
    await this.loadSizes();
  }

  clearSearch = () => {
    this.term = "";
    this.tempList = [];
  }

  loadSizes = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductSize.sizeList(term);
      runInAction(() => {
        if (term) {
          // Nếu có term (search), lưu vào tempList
          this.tempList = result.data || [];
        } else {
          // Nếu không có term, load toàn bộ vào productSizeList
          this.productSizeList = result.data || [];
          // Cập nhật registry
          this.productSizeRegistry.clear();
          this.productSizeList.forEach(size => {
            if (size.id != null) this.productSizeRegistry.set(size.id, size);
          });
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load size", error);
      toast.error("Lỗi khi tải dữ liệu kích thước.")
    }
  };

  resetSizeForm = () => {
    this.sizeForm = {
      wide: 0,
      length: 0,
      autoSized: "",
      companyCodeId: null
    };
  };

  updateSizeForm = <K extends keyof AddSizeDto>(key: K, value: AddSizeDto[K]) => {
    this.sizeForm[key] = value;
  };

  addSize = async () => {
    this.loading = true;
    try{
      const result = await agent.ProductSize.addSize(this.sizeForm);
      if(result.success){
        toast.success("Thêm kích thước thành công.");
        this.loadAllSizes(); // Reload toàn bộ list
        this.resetSizeForm();
        this.loading = false;
        const newItem: ProductSizeDto = {
          id: Date.now(),
          wide: this.sizeForm.wide,
          length: this.sizeForm.length,
          autoSized: this.sizeForm.autoSized,
          companyCodeId: this.sizeForm.companyCodeId
        };
        this.addItemToMetadata(newItem);
        return true;
      }else{
        toast.error("Lỗi khi thêm kích thước.");
        this.loading = false;
        return false;
      }
    }catch(error){
      console.error("Failed to add size", error);
      toast.error("Lỗi khi thêm kích thước.");
    }finally{
      this.loading = false;
    }
  }

  updateSize = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductSize.updateSize(id, this.sizeFormUpdate);
      if (result.success) {
        toast.success("Cập nhật kích thước thành công.");
        await this.loadAllSizes(); // Reload toàn bộ list
        this.resetSizeForm();
        this.loading = false;
        const updatedItem: ProductSizeDto = {
          id: id,
          wide: this.sizeFormUpdate.wide,
          length: this.sizeFormUpdate.length,
          autoSized: this.sizeFormUpdate.autoSized,
          companyCodeId: this.sizeFormUpdate.companyCodeId
        };
        this.addItemToMetadata(updatedItem);
        return true;
      } else {
        toast.error("Lỗi khi cập nhật kích thước.");
        this.loading = false;
        return false;
      }
    } catch (error) {
      console.error("Failed to update size", error);
      toast.error("Lỗi khi cập nhật kích thước.");
      this.loading = false;
      return false;
    }
  }

  updateSizeFormUpdate = <K extends keyof UpdateSizeDto>(field: K, value: UpdateSizeDto[K]) => {
    runInAction(() => {
      this.sizeFormUpdate = {
        ...this.sizeFormUpdate,
        [field]: value
      };
    });
  }

  deleteSize = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductSize.deleteSize(id);
      if (result.success) {
        toast.success(result.data);
        this.loadAllSizes(); // Reload toàn bộ list
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

  private updateMetadataInLocalStorage = (sizeList: ProductSizeDto[]) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productSizeDtos = sizeList;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private addItemToMetadata = (newItem: ProductSizeDto) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productSizeDtos.push(newItem);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private removeItemFromMetadata = (id: number) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productSizeDtos = currentMetadata.productSizeDtos.filter(
        item => item.id !== id
      );
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }
}