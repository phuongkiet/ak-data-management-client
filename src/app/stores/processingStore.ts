import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddProcessingDto, ProductProcessingDto } from '../models/product/productProcessing.model.ts'

export default class ProcessingStore {
  productProcessingList: ProductProcessingDto[] = [];
  productProcessingRegistry = new Map<number, ProductProcessingDto>();
  loading = false;

  processingForm: AddProcessingDto = {
    processingCode: "",
    processingDescription: null
  }

  constructor() {
    makeAutoObservable(this);
  }

  loadProcessings = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductProcessing.processingList();
      console.log(result);
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
      console.log(result);
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
}