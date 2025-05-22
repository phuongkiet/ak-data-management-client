import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddMaterialDto, ProductMaterialDto } from '../models/product/productMaterial.model.ts'

export default class MaterialStore {
  productMaterialList: ProductMaterialDto[] = [];
  productMaterialRegistry = new Map<number, ProductMaterialDto>();
  loading = false;
  term: string = '';

  materialForm: AddMaterialDto = {
    name: "",
    description: null
  };

  constructor() {
    makeAutoObservable(this);
    console.log(this.productMaterialList)
  }

  setProductMaterialList = (list: ProductMaterialDto[]) => {
    this.productMaterialList = list;
  }

  setTerm = (term: string) => {
    this.term = term;
    this.loadMaterials(this.term);
  }

  loadMaterials = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductMaterial.materialList(term);
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

  resetMaterialForm = () => {
    this.materialForm = {
      name: "",
      description: null
    };
  }

  updateMaterialForm = <K extends keyof AddMaterialDto>(field: K, value: AddMaterialDto[K]) => {
    runInAction(() => {
      this.materialForm[field] = value;
    });
  }

  addMaterial = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductMaterial.addMaterial(this.materialForm);
      if (result.success) {
        toast.success("Thêm chất liệu thành công.");
        this.loadMaterials();
        this.resetMaterialForm();
        this.loading = false;
        return true;
      }
    } catch (error) {
      console.error("Failed to add material", error);
      toast.error("Lỗi khi thêm chất liệu.");
    } finally {
      this.loading = false;
    }
  }
}