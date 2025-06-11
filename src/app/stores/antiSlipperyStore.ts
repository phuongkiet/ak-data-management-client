import { action, makeObservable, observable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddAntiSlipperyDto, ProductAntiSlipperyDto, UpdateAntiSlipperyDto } from '../models/product/productAntiSlippery.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class AntiSlipperyStore extends BaseStore {
  productAntiSlipperyList: ProductAntiSlipperyDto[] = [];
  productAntiSlipperyRegistry = new Map<number, ProductAntiSlipperyDto>();
  loading = false;
  term: string = '';

  antiSlipperyForm: AddAntiSlipperyDto = {
    antiSlipLevel: "",
    description: null
  }

  antiSlipperyFormUpdate: UpdateAntiSlipperyDto = {
    antiSlipLevel: "",
    description: null
  }

  constructor() {
    super();
    makeObservable(this, {
      productAntiSlipperyList: observable,
      productAntiSlipperyRegistry: observable,
      loading: observable,
      term: observable,
      antiSlipperyForm: observable,
      antiSlipperyFormUpdate: observable,
      setProductAntiSlipperyList: action,
      setTerm: action,
      loadAntiSlipperys: action,
      resetAntiSlipperyForm: action,
      updateAntiSlipperyForm: action,
      addAntiSlippery: action,
      updateAntiSlippery: action,
      updateAntiSlipperyFormUpdate: action,
    });
  }

  setProductAntiSlipperyList = (list: ProductAntiSlipperyDto[]) => {
    this.productAntiSlipperyList = list;
    this.productAntiSlipperyRegistry.clear();
    list.forEach((antiSlippery) => {
      if (antiSlippery.id != null)
        this.productAntiSlipperyRegistry.set(antiSlippery.id, antiSlippery);
    });

    // Update metadata in localStorage
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productAntiSlipperyDtos = list;
      OfflineStorage.saveMetadata(currentMetadata);
    }

  }

  setTerm = (term: string) => {
    this.term = term;
    this.loadAntiSlipperys(this.term);
  }

  loadAntiSlipperys = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.AntiSlippery.antiSlipperyList(term);
      runInAction(() => {
        this.productAntiSlipperyList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productAntiSlipperyRegistry.clear();
        this.productAntiSlipperyList.forEach(antiSlippery => {
          if (antiSlippery.id != null) this.productAntiSlipperyRegistry.set(antiSlippery.id, antiSlippery);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load anti slippery", error);
      toast.error("Lỗi khi tải dữ liệu độ chống trươt.")
    }
  };

  updateAntiSlipperyForm = <K extends keyof AddAntiSlipperyDto>(field: K, value: AddAntiSlipperyDto[K]) => {
    runInAction(() => {
      this.antiSlipperyForm[field] = value;
    });
  }

  resetAntiSlipperyForm = () => {
    this.antiSlipperyForm = {
      antiSlipLevel: "",
      description: null
    };
  }

  addAntiSlippery = async () => {
    this.loading = true;
    try {
      const result = await agent.AntiSlippery.addAntiSlippery(this.antiSlipperyForm);
      if (result.success) {
        toast.success("Thêm độ chống trươt thành công.");
        this.loadAntiSlipperys();
        this.resetAntiSlipperyForm();
        this.loading = false;
        return true;
      } else {
        toast.error("Lỗi khi thêm độ chống trươt.");
        this.loading = false;
        return false;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateAntiSlippery = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.AntiSlippery.updateAntiSlippery(id, this.antiSlipperyFormUpdate);
      if (result.success) {
        toast.success("Cập nhật độ chống trươt thành công.");
        this.loadAntiSlipperys();
        this.resetAntiSlipperyForm();
        this.loading = false;
        return true;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateAntiSlipperyFormUpdate = <K extends keyof UpdateAntiSlipperyDto>(field: K, value: UpdateAntiSlipperyDto[K]) => {
    runInAction(() => {
      this.antiSlipperyFormUpdate = {
        ...this.antiSlipperyFormUpdate,
        [field]: value
      };
    });
  }
}