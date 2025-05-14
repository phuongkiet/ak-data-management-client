import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddSizeDto, ProductSizeDto } from '../models/product/productSize.model.ts'

export default class SizeStore {
  productSizeList: ProductSizeDto[] = [];
  productSizeRegistry = new Map<number, ProductSizeDto>();
  loading = false;
  term: string = '';

  sizeForm: AddSizeDto = {
    wide: 0,
    length: 0,
    autoSized: ""
  };

  constructor() {
    makeAutoObservable(this);
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
      autoSized: ""
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
}