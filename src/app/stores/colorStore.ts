import { action, makeObservable, observable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddColorDto, ProductColorDto, UpdateColorDto } from '../models/product/productColor.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class ColorStore extends BaseStore {
  productColorList: ProductColorDto[] = [];
  productColorRegistry = new Map<number, ProductColorDto>();
  loading = false;
  term: string = '';

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
    // Update metadata in localStorage
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productColorDtos = list;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  setTerm = (term: string) => {
    this.term = term;
    this.loadColors(this.term);
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
        this.productColorList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productColorRegistry.clear();
        this.productColorList.forEach(color => {
          if (color.id != null) this.productColorRegistry.set(color.id, color);
        });
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
        this.loadColors();
        this.resetColorForm();
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
        this.loadColors();
        this.resetColorForm();
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
        this.loadColors();
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