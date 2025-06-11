import { action, makeObservable, observable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddProcessingDto, ProductProcessingDto, UpdateProcessingDto } from '../models/product/productProcessing.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class ProcessingStore extends BaseStore {
  productProcessingList: ProductProcessingDto[] = [];
  productProcessingRegistry = new Map<number, ProductProcessingDto>();
  loading = false;
  term: string = '';

  processingForm: AddProcessingDto = {
    processingCode: "",
    processingDescription: null
  }

  processingFormUpdate: UpdateProcessingDto = {
    processingCode: "",
    processingDescription: null
  };

  constructor() {
    super();
    makeObservable(this, {
      productProcessingList: observable,
      productProcessingRegistry: observable,
      loading: observable,
      term: observable,
      processingForm: observable,
      processingFormUpdate: observable,
      setProductProcessingList: action,
      setTerm: action,
      loadProcessings: action,
      resetProcessingForm: action,
      updateProcessingForm: action,
      addProcessing: action,
      updateProcessing: action,
      updateProcessingFormUpdate: action,
    });
  }

  setProductProcessingList = (list: ProductProcessingDto[]) => {
    this.productProcessingList = list;
    this.productProcessingRegistry.clear();
    list.forEach((processing) => {
      if (processing.id != null)
        this.productProcessingRegistry.set(processing.id, processing);
    });
    // Update metadata in localStorage
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productProcessingDtos = list;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  setTerm = (term: string) => {
    this.term = term;
    this.loadProcessings(this.term);
  }

  loadProcessings = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductProcessing.processingList(term);
      runInAction(() => {
        this.productProcessingList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productProcessingRegistry.clear();
        this.productProcessingList.forEach(processing => {
          if (processing.id != null) this.productProcessingRegistry.set(processing.id, processing);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load product processing", error);
      toast.error("Lỗi khi tải dữ liệu gia công khác.")
    }
  };

  updateProcessingForm = <K extends keyof AddProcessingDto>(field: K, value: AddProcessingDto[K]) => {
    runInAction(() => {
      this.processingForm[field] = value;
    });
  }

  resetProcessingForm = () => {
    this.processingForm = {
      processingCode: "",
      processingDescription: null
    };
  }

  addProcessing = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductProcessing.addProcessing(this.processingForm);
      if (result.success) {
        toast.success("Thêm gia công khác thành công.")
        this.loadProcessings();
        this.resetProcessingForm();
        this.loading = false;
        return true;
      } else {
        toast.error("Lỗi khi thêm gia công khác.")
        this.loading = false;
        return false;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to add product processing", error);
      toast.error("Lỗi khi thêm gia công khác.")
    }
  }

  updateProcessing = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductProcessing.updateProcessing(id, this.processingFormUpdate);
      if (result.success) {
        toast.success("Cập nhật gia công khác thành công.");
        this.loadProcessings();
        this.resetProcessingForm();
        this.loading = false;
        return true;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateProcessingFormUpdate = <K extends keyof UpdateProcessingDto>(field: K, value: UpdateProcessingDto[K]) => {
    runInAction(() => {
      this.processingFormUpdate = {
        ...this.processingFormUpdate,
        [field]: value
      };
    });
  }
}