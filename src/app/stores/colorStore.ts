import { action, makeObservable, observable, runInAction, computed } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddColorDto, ProductColorDto, UpdateColorDto } from '../models/product/productColor.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class ColorStore extends BaseStore {
  productColorList: ProductColorDto[] = [];
  productColorRegistry = new Map<number, ProductColorDto>();
  tempList: ProductColorDto[] = [];
  loading = false;
  term: string = '';

  get displayList() {
    return this.term ? this.tempList : this.productColorList;
  }

  colorForm: AddColorDto = {
    name: "",
    colorHexCode: null
  };

  colorFormUpdate: UpdateColorDto = {
    name: "",
    colorHexCode: null
  };

  constructor() {
    super();
    makeObservable(this, {
      productColorList: observable,
      productColorRegistry: observable,
      tempList: observable,
      displayList: computed,
      loading: observable,
      term: observable,
      colorForm: observable,
      colorFormUpdate: observable,
      setProductColorList: action,
      setTerm: action,
      loadColors: action,
      resetColorForm: action,
      updateColorForm: action,
      addColor: action,
      updateColor: action,
      updateColorFormUpdate: action,
      deleteColor: action,
    });
  }

  setProductColorList = (list: ProductColorDto[]) => {
    this.productColorList = list;
    this.productColorRegistry.clear();
    list.forEach((color) => {
      if (color.id != null)
        this.productColorRegistry.set(color.id, color);
    });
    this.updateMetadataInLocalStorage(list);
  }

  setTerm = (term: string) => {
    this.term = term;
    // Không tự động gọi search nữa, chỉ lưu term
  }

  searchColor = async () => {
    await this.loadColors(this.term ?? undefined);
  }

  loadAllColors = async () => {
    await this.loadColors();
  }

  clearSearch = () => {
    this.term = "";
    this.tempList = [];
  }

  resetColorForm = () => {
    this.colorForm = {
      name: "",
      colorHexCode: null
    };
  }

  loadColors = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductColor.colorList(term);
      runInAction(() => {
        if (term) {
          // Nếu có term (search), lưu vào tempList
          this.tempList = result.data || [];
        } else {
          // Nếu không có term, load toàn bộ vào productColorList
          this.productColorList = result.data || [];
          // Cập nhật registry
          this.productColorRegistry.clear();
          this.productColorList.forEach((color) => {
            if (color.id != null)
              this.productColorRegistry.set(color.id, color);
          });
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load color", error);
      toast.error("Lỗi khi tải dữ liệu màu sắc.")
    }
  };

  updateColorForm = <K extends keyof AddColorDto>(field: K, value: AddColorDto[K]) => {
    runInAction(() => {
      this.colorForm[field] = value;
    });
  }

  addColor = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductColor.addColor(this.colorForm);
      if (result.success) {
        toast.success("Thêm màu sắc thành công.");
        this.loadAllColors();
        this.resetColorForm();
        const newItem: ProductColorDto = {
          id: Date.now(),
          name: this.colorForm.name,
          colorHexCode: this.colorForm.colorHexCode
        };
        this.addItemToMetadata(newItem);
        this.loading = false;
        return true;
      } else{
        toast.error("Lỗi khi thêm màu sắc.");
        this.loading = false;
        return false;
      }
    } catch (error) {
      console.error("Failed to add color", error);
      toast.error("Lỗi khi thêm màu sắc.");
    } finally {
      this.loading = false;
    }
  }

  updateColor = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductColor.updateColor(id, this.colorFormUpdate);
      if (result.success) {
        toast.success("Cập nhật màu sắc thành công.");
        this.loadAllColors();
        this.resetColorForm();
        const updatedItem: ProductColorDto = {
          id: id,
          name: this.colorFormUpdate.name,
          colorHexCode: this.colorFormUpdate.colorHexCode
        };
        this.addItemToMetadata(updatedItem);
        this.loading = false;
        return true;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateColorFormUpdate = <K extends keyof UpdateColorDto>(field: K, value: UpdateColorDto[K]) => {
    runInAction(() => {
      this.colorFormUpdate = {
        ...this.colorFormUpdate,
        [field]: value
      };
    });
  }

  deleteColor = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductColor.deleteColor(id);
      if (result.success) {
        toast.success(result.data);
        this.loadAllColors();
        this.removeItemFromMetadata(id);
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

  private updateMetadataInLocalStorage = (colorList: ProductColorDto[]) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productColorDtos = colorList;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private removeItemFromMetadata = (id: number) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productColorDtos = currentMetadata.productColorDtos.filter(item => item.id !== id);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  } 

  private addItemToMetadata = (newItem: ProductColorDto) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productColorDtos.push(newItem);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }
}