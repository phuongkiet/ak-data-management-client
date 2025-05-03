import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { ProductProcessingDto } from '../models/product/productProcessing.model.ts'

export default class ProcessingStore {
  productProcessingList: ProductProcessingDto[] = [];
  productProcessingRegistry = new Map<number, ProductProcessingDto>();
  loading = false;

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
}