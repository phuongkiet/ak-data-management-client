import { makeObservable, observable, action, runInAction, computed } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddMaterialDto, ProductMaterialDto, UpdateMaterialDto } from '../models/product/productMaterial.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class MaterialStore extends BaseStore {
  productMaterialList: ProductMaterialDto[] = [];
  productMaterialRegistry = new Map<number, ProductMaterialDto>();
  tempList: ProductMaterialDto[] = []; // Thêm temp list cho search
  loading = false;
  term: string = '';

  materialForm: AddMaterialDto = {
    name: "",
    shortName: "",
    description: null
  };

  materialFormUpdate: UpdateMaterialDto = {
    name: "",
    shortName: "",
    description: null
  };

  // Getter để trả về list phù hợp
  get displayList() {
    return this.term ? this.tempList : this.productMaterialList;
  }

  constructor() {
    super();
    makeObservable(this, {
      productMaterialList: observable,
      productMaterialRegistry: observable,
      tempList: observable,
      loading: observable,
      term: observable,
      materialForm: observable,
      materialFormUpdate: observable,
      displayList: computed,
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
    this.updateMetadataInLocalStorage(list);
  }

  setTerm = (term: string) => {
    this.term = term;
    // Không tự động gọi search nữa, chỉ lưu term
  }

  searchMaterial = async () => {
    await this.loadMaterials(this.term);
  }

  loadAllMaterials = async () => {
    await this.loadMaterials();
  }

  clearSearch = () => {
    this.term = "";
    this.tempList = [];
  }

  loadMaterials = async (term?: string) => {
    this.loading = true;
    let retryCount = 0;
    const maxRetries = 3;
    
    const tryLoadMaterials = async () => {
      try {
        const result = await agent.ProductMaterial.materialList(term);
        runInAction(() => {
          if (term) {
            // Nếu có term (search), lưu vào tempList
            this.tempList = result.data || [];
          } else {
            // Nếu không có term, load toàn bộ vào productMaterialList
            this.productMaterialList = result.data || [];
            // Cập nhật registry
            this.productMaterialRegistry.clear();
            this.productMaterialList.forEach(material => {
              if (material.id != null) this.productMaterialRegistry.set(material.id, material);
            });
          }
          this.loading = false;
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
      shortName: "",
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
        this.loadAllMaterials(); // Reload toàn bộ list
        this.resetMaterialForm();
        this.loading = false;
        const newItem: ProductMaterialDto = {
          id: Date.now(),
          name: this.materialForm.name,
          shortName: this.materialForm.shortName,
          description: this.materialForm.description
        };
        this.addItemToMetadata(newItem);
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
        this.loadAllMaterials(); // Reload toàn bộ list
        this.resetMaterialForm();
        this.loading = false;
        const updatedItem: ProductMaterialDto = {
          id: id,
          name: this.materialFormUpdate.name,
          shortName: this.materialFormUpdate.shortName,
          description: this.materialFormUpdate.description
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
        this.loadAllMaterials(); // Reload toàn bộ list
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

  private updateMetadataInLocalStorage = (materialList: ProductMaterialDto[]) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productMaterialDtos = materialList;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private addItemToMetadata = (newItem: ProductMaterialDto) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productMaterialDtos.push(newItem);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private removeItemFromMetadata = (id: number) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productMaterialDtos = currentMetadata.productMaterialDtos.filter(
        item => item.id !== id
      );
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }
}