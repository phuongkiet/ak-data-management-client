import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddOriginDto, ProductOriginDto } from '../models/product/productOrigin.model.ts'

export default class OriginStore {
  productOriginList: ProductOriginDto[] = [];
  productOriginRegistry = new Map<number, ProductOriginDto>();
  loading = false;
  term: string = '';

  originForm: AddOriginDto = {
    name: "",
    upperName: ""
  };

  constructor() {
    makeAutoObservable(this);
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
}