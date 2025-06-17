import { action, makeObservable, observable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddSizeDto, ProductSizeDto, UpdateSizeDto } from '../models/product/productSize.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class SizeStore extends BaseStore {
  productSizeList: ProductSizeDto[] = [];
  productSizeRegistry = new Map<number, ProductSizeDto>();
  loading = false;
  term: string = '';

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
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productSizeDtos = this.productSizeList;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  } 

  setTerm = (term: string) => {
    this.term = term;
    this.loadSizes(this.term);
  }

  loadSizes = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductSize.sizeList(term);
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
        this.loadSizes();
        this.resetSizeForm();
        this.loading = false;
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
        await this.loadSizes();
        this.resetSizeForm();
        this.loading = false;
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
}