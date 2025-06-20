import { makeObservable, observable, action, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddMaterialDto, ProductMaterialDto, UpdateMaterialDto } from '../models/product/productMaterial.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class MaterialStore extends BaseStore {
  productMaterialList: ProductMaterialDto[] = [];
  productMaterialRegistry = new Map<number, ProductMaterialDto>();
  loading = false;
  term: string = '';

  materialForm: AddMaterialDto = {
    name: "",
    description: null
  };

  materialFormUpdate: UpdateMaterialDto = {
    name: "",
    description: null
  };

  constructor() {
    super();
    makeObservable(this, {
      productMaterialList: observable,
      productMaterialRegistry: observable,
      loading: observable,
      term: observable,
      materialForm: observable,
      materialFormUpdate: observable,
      setProductMaterialList: action,
      setTerm: action,
      loadMaterials: action,
      resetMaterialForm: action,
      updateMaterialForm: action,
      addMaterial: action,
      updateMaterial: action,
      updateMaterialFormUpdate: action,
      deleteMaterial: action,
    });
  }

  setProductMaterialList = (list: ProductMaterialDto[]) => {
    this.productMaterialList = list;
    this.productMaterialRegistry.clear();
    list.forEach((material) => {
      if (material.id != null)
        this.productMaterialRegistry.set(material.id, material);
    });
    // Update metadata in localStorage
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productMaterialDtos = list;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  setTerm = (term: string) => {
    this.term = term;
    this.loadMaterials(this.term);
  }

  loadMaterials = async (term?: string) => {
    this.loading = true;
    let retryCount = 0;
    const maxRetries = 3;
    
    const tryLoadMaterials = async () => {
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
      } catch (error: any) {
        if (error.response?.status === 503 && retryCount < maxRetries) {
          retryCount++;
          // Wait for 2 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
          return tryLoadMaterials();
        }
        
        runInAction(() => {
          this.loading = false;
        });
        console.error("Failed to load material", error);
        toast.error("Lỗi khi tải dữ liệu chất liệu.")
      }
    };

    await tryLoadMaterials();
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

  updateMaterial = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductMaterial.updateMaterial(id, this.materialFormUpdate);
      if (result.success) {
        toast.success("Cập nhật chất liệu thành công.");
        this.loadMaterials();
        this.resetMaterialForm();
        this.loading = false;
        return true;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateMaterialFormUpdate = <K extends keyof UpdateMaterialDto>(field: K, value: UpdateMaterialDto[K]) => {
    runInAction(() => {
      this.materialFormUpdate = {
        ...this.materialFormUpdate,
        [field]: value
      };
    });
  }

  deleteMaterial = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductMaterial.deleteMaterial(id);
      if (result.success) {
        toast.success(result.data);
        this.loadMaterials();
        this.loading = false;
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
}