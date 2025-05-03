import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { ProductMaterialDto } from '../models/product/productMaterial.model.ts'

export default class MaterialStore {
  productMaterialList: ProductMaterialDto[] = [];
  productMaterialRegistry = new Map<number, ProductMaterialDto>();
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadMaterials = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductMaterial.materialList();
      console.log(result);
      runInAction(() => {
        this.productMaterialList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productMaterialRegistry.clear();
        this.productMaterialList.forEach(supplier => {
          if (supplier.id != null) this.productMaterialRegistry.set(supplier.id, supplier);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load material", error);
      toast.error("Lỗi khi tải dữ liệu chất liệu.")
    }
  };
}