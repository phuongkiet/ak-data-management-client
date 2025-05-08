import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { ProductFactoryDto } from '../models/product/productFactory.model.ts';

export default class FactoryStore {
  productFactoryList: ProductFactoryDto[] = [];
  productFactoryRegistry = new Map<number, ProductFactoryDto>();
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadFactories = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductFactory.factoryList();
      console.log(result);
      runInAction(() => {
        this.productFactoryList = result.data || [];
        this.loading = false;

        // Store factories in a Map
        this.productFactoryRegistry.clear();
        this.productFactoryList.forEach(factory => {
          if (factory.id != null) this.productFactoryRegistry.set(factory.id, factory);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load factory", error);
      toast.error("Lỗi khi tải dữ liệu nhà máy.")
    }
  };

  getFactoriesBySupplier = async (supplierId: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductFactory.getFactoriesBySupplier(supplierId);
      runInAction(() => {
        this.productFactoryList = result.data || [];
        this.loading = false;

        // Store factories in a Map
        this.productFactoryRegistry.clear();
        this.productFactoryList.forEach(factory => {
          if (factory.id != null) this.productFactoryRegistry.set(factory.id, factory);
        });
      });
      return result.data || [];
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load factories by supplier", error);
      toast.error("Lỗi khi tải dữ liệu nhà máy theo nhà cung cấp.")
      return [];
    }
  };
}