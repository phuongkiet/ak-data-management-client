import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddPatternDto, ProductPatternDto } from '../models/product/productPattern.model.ts'

export default class PatternStore {
  productPatternList: ProductPatternDto[] = [];
  productPatternRegistry = new Map<number, ProductPatternDto>();
  loading = false;

  patternForm: AddPatternDto = {
    name: '',
    shortCode: '',
    description: ''
  };

  constructor() {
    makeAutoObservable(this);
  }

  resetPatternForm = () => {
    this.patternForm = {
      name: '',
      shortCode: '',
      description: ''
    };
  };

  loadPatterns = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductPattern.patternList();
      console.log(result);
      runInAction(() => {
        this.productPatternList = result.data || [];
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
        await this.loadPatterns();
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
}