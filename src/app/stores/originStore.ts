import { action, makeObservable, observable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddOriginDto, ProductOriginDto, UpdateOriginDto } from '../models/product/productOrigin.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class OriginStore extends BaseStore {
  productOriginList: ProductOriginDto[] = [];
  productOriginRegistry = new Map<number, ProductOriginDto>();
  loading = false;
  term: string = '';

  originForm: AddOriginDto = {
    name: "",
    upperName: ""
  };

  originFormUpdate: UpdateOriginDto = {
    name: "",
    upperName: ""
  };

  constructor() {
    super();
    makeObservable(this, {
      productOriginList: observable,
      productOriginRegistry: observable,
      loading: observable,
      term: observable,
      originForm: observable,
      originFormUpdate: observable,
      setProductOriginList: action,
      setTerm: action,
      loadOrigins: action,
      resetOriginForm: action,
      updateOriginForm: action,
      addOrigin: action,
      updateOrigin: action,
      updateOriginFormUpdate: action,
    });
  }

  setProductOriginList = (list: ProductOriginDto[]) => {
    this.productOriginList = list;
    this.productOriginRegistry.clear();
    list.forEach((origin) => {
      if (origin.id != null)
        this.productOriginRegistry.set(origin.id, origin);
    });
    // Update metadata in localStorage
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productOriginDtos = list;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  setTerm = (term: string) => {
    this.term = term;
    this.loadOrigins(this.term);
  }

  loadOrigins = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductOrigin.originList(term);
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

  updateOriginForm = <K extends keyof AddOriginDto>(field: K, value: AddOriginDto[K]) => {
    runInAction(() => {
      this.originForm[field] = value;
    });
  };

  resetOriginForm = () => {
    this.originForm = {
      name: "",
      upperName: ""
    };
  };

  addOrigin = async () => {
    this.loading = true;
    try{
      const result = await agent.ProductOrigin.addOrigin(this.originForm);
      if (result.success) {
        toast.success("Thêm xuất xứ thành công.");
        this.loadOrigins();
        this.resetOriginForm();
        this.loading = false;
        return true;
      }else{
        toast.error("Lỗi khi thêm xuất xứ.");
        this.loading = false;
        return false;
      }
    }catch(error){
      console.error("Failed to add origin", error);
      toast.error("Lỗi khi thêm xuất xứ.");
    }finally{
      this.loading = false;
    }
  }

  updateOrigin = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductOrigin.updateOrigin(id, this.originFormUpdate);
      if (result.success) {
        toast.success("Cập nhật xuất xứ thành công.");
        this.loadOrigins();
        this.resetOriginForm();
        this.loading = false;
        return true;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateOriginFormUpdate = <K extends keyof UpdateOriginDto>(field: K, value: UpdateOriginDto[K]) => {
    runInAction(() => {
      this.originFormUpdate = {
        ...this.originFormUpdate,
        [field]: value
      };
    });
  }
}