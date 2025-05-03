import { ProductSupplierDto } from '../models/product/productSupplier.model.ts'
import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'

export default class SupplierStore {
  productSupplierList: ProductSupplierDto[] = [];
  productSupplierRegistry = new Map<number, ProductSupplierDto>();
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadSuppliers = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductSupplier.supplierList();
      console.log(result);
      runInAction(() => {
        this.productSupplierList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productSupplierRegistry.clear();
        this.productSupplierList.forEach(supplier => {
          if (supplier.id != null) this.productSupplierRegistry.set(supplier.id, supplier);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load supplier", error);
      toast.error("Lỗi khi tải dữ liệu nhà cung cấp.")
    }
  };
}