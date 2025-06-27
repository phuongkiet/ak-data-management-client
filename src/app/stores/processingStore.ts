import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddProcessingDto, ProductProcessingDto, UpdateProcessingDto } from '../models/product/productProcessing.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class ProcessingStore extends BaseStore {
  productProcessingList: ProductProcessingDto[] = [];
  productProcessingRegistry = new Map<number, ProductProcessingDto>();
  loading = false;
  tempList: ProductProcessingDto[] = [];
  term: string = '';

  get displayList() {
    return this.term ? this.tempList : this.productProcessingList;
  }

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
      tempList: observable,
      displayList: computed,
      setProductProcessingList: action,
      setTerm: action,
      loadProcessings: action,
      resetProcessingForm: action,
      updateProcessingForm: action,
      addProcessing: action,
      updateProcessing: action,
      updateProcessingFormUpdate: action,
      deleteProcessing: action,
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
    this.updateMetadataInLocalStorage(list);
  }

  setTerm = (term: string) => {
    this.term = term;
  }

  searchProcessing = async () => {
    await this.loadProcessings(this.term);
  }

  loadAllProcessings = async () => {
    await this.loadProcessings();
  }

  clearSearch = () => {
    this.term = "";
    this.tempList = [];
  }

  loadProcessings = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductProcessing.processingList(term);
      runInAction(() => {
        if (term) {
          // Nếu có term (search), lưu vào tempList
          this.tempList = result.data || [];
        } else {
          // Nếu không có term, load toàn bộ vào productProcessingList
          this.productProcessingList = result.data || [];
          // Cập nhật registry
          this.productProcessingRegistry.clear();
          this.productProcessingList.forEach(processing => {
            if (processing.id != null) this.productProcessingRegistry.set(processing.id, processing);
          });
        }
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
        this.loadAllProcessings(); // Reload toàn bộ list
        this.resetProcessingForm();
        this.loading = false;
        const newItem: ProductProcessingDto = {
          id: Date.now(),
          processingCode: this.processingForm.processingCode,
          processingDescription: this.processingForm.processingDescription
        };
        this.addItemToMetadata(newItem);
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
        this.loadAllProcessings(); // Reload toàn bộ list
        this.resetProcessingForm();
        this.loading = false;
        const updatedItem: ProductProcessingDto = {
          id: id,
          processingCode: this.processingFormUpdate.processingCode,
          processingDescription: this.processingFormUpdate.processingDescription
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

  updateProcessingFormUpdate = <K extends keyof UpdateProcessingDto>(field: K, value: UpdateProcessingDto[K]) => {
    runInAction(() => {
      this.processingFormUpdate = {
        ...this.processingFormUpdate,
        [field]: value
      };
    });
  }

  deleteProcessing = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductProcessing.deleteProcessing(id);
      if (result.success) {
        toast.success(result.data);
        this.loadProcessings();
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

  private updateMetadataInLocalStorage = (processingList: ProductProcessingDto[]) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productProcessingDtos = processingList;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private addItemToMetadata = (newItem: ProductProcessingDto) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productProcessingDtos.push(newItem);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private removeItemFromMetadata = (id: number) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productProcessingDtos = currentMetadata.productProcessingDtos.filter(
        item => item.id !== id
      );
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }
}