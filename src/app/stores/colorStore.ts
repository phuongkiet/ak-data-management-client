import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddColorDto, ProductColorDto } from '../models/product/productColor.model.ts'

export default class ColorStore {
  productColorList: ProductColorDto[] = [];
  productColorRegistry = new Map<number, ProductColorDto>();
  loading = false;

  colorForm: AddColorDto = {
    name: "",
    colorHexCode: null
  };

  constructor() {
    makeAutoObservable(this);
  }

  resetColorForm = () => {
    this.colorForm = {
      name: "",
      colorHexCode: null
    };
  }

  loadColors = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductColor.colorList();
      console.log(result);
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
}