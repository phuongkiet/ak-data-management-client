import { action, makeObservable, observable, runInAction, computed } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddOriginDto, ProductOriginDto, UpdateOriginDto } from '../models/product/productOrigin.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class OriginStore extends BaseStore {
  productOriginList: ProductOriginDto[] = [];
  productOriginRegistry = new Map<number, ProductOriginDto>();
  tempList: ProductOriginDto[] = [];
  loading = false;
  term: string = '';

  get displayList() {
    return this.term ? this.tempList : this.productOriginList;
  }

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
      tempList: observable,
      displayList: computed,
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
      deleteOrigin: action,
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
    this.updateMetadataInLocalStorage(list);
  }

  setTerm = (term: string) => {
    this.term = term;
    // Không tự động gọi search nữa, chỉ lưu term
  }

  loadAllOrigins = async () => {
    await this.loadOrigins();
  }

  clearSearch = () => {
    this.term = "";
    this.tempList = [];
  }

  searchOrigin = async () => {
    await this.loadOrigins(this.term);
  }

  loadOrigins = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductOrigin.originList(term);
      runInAction(() => {
        if (term) {
          // Nếu có term (search), lưu vào tempList
          this.tempList = result.data || [];
        } else {
          // Nếu không có term, load toàn bộ vào productOriginList
          this.productOriginList = result.data || [];
          // Cập nhật registry
          this.productOriginRegistry.clear();
          this.productOriginList.forEach(origin => {
            if (origin.id != null) this.productOriginRegistry.set(origin.id, origin);
          });
        }
        this.loading = false;
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
        this.loadAllOrigins(); // Reload toàn bộ list
        this.resetOriginForm();
        this.loading = false;
        const newItem: ProductOriginDto = {
          id: Date.now(),
          name: this.originForm.name,
          upperName: this.originForm.upperName
        };
        this.addItemToMetadata(newItem);
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
        this.loadAllOrigins(); // Reload toàn bộ list
        this.resetOriginForm();
        this.loading = false;
        const updatedItem: ProductOriginDto = {
          id: id,
          name: this.originFormUpdate.name,
          upperName: this.originFormUpdate.upperName
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

  updateOriginFormUpdate = <K extends keyof UpdateOriginDto>(field: K, value: UpdateOriginDto[K]) => {
    runInAction(() => {
      this.originFormUpdate = {
        ...this.originFormUpdate,
        [field]: value
      };
    });
  }

  deleteOrigin = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductOrigin.deleteOrigin(id);
      if (result.success) {
        toast.success(result.data);
        this.loadAllOrigins(); // Reload toàn bộ list
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

  private updateMetadataInLocalStorage = (originList: ProductOriginDto[]) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productOriginDtos = originList;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private addItemToMetadata = (newItem: ProductOriginDto) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productOriginDtos.push(newItem);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private removeItemFromMetadata = (id: number) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productOriginDtos = currentMetadata.productOriginDtos.filter(
        item => item.id !== id
      );
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }
}