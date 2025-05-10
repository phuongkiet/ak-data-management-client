import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent.ts";
import { toast } from "react-toastify";
import {
  AddBodyColorDto,
  ProductBodyColorDto,
} from "../models/product/productBodyColor.model.ts";

export default class BodyColorStore {
  productBodyColorList: ProductBodyColorDto[] = [];
  productBodyColorRegistry = new Map<number, ProductBodyColorDto>();
  loading = false;

  bodyColorForm: AddBodyColorDto = {
    name: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  loadBodyColors = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductBodyColor.bodyColorList();
      console.log(result);
      runInAction(() => {
        this.productBodyColorList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productBodyColorRegistry.clear();
        this.productBodyColorList.forEach((bodyColor) => {
          if (bodyColor.id != null)
            this.productBodyColorRegistry.set(bodyColor.id, bodyColor);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load body color", error);
      toast.error("Lỗi khi tải dữ liệu màu sắc thân gạch.");
    }
  };

  resetBodyColorForm = () => {
    this.bodyColorForm = {
      name: "",
    };
  };

  updateBodyColorForm = <K extends keyof AddBodyColorDto>(field: K, value: AddBodyColorDto[K]) => {
    runInAction(() => {
      this.bodyColorForm[field] = value;
    });
  };

  addBodyColor = async () => {
    this.loading = true;
    try {
      const result = await agent.ProductBodyColor.addBodyColor(
        this.bodyColorForm
      );
      if (result.success) {
        toast.success("Thêm màu sắc thân gạch thành công.");
        this.loadBodyColors();
        this.resetBodyColorForm();
        this.loading = false;
        return true;
      } else {
        toast.error("Lỗi khi thêm màu sắc thân gạch.");
        this.loading = false;
        return false;
      }
    } catch (error) {
      console.error("Failed to add color", error);
      toast.error("Lỗi khi thêm màu sắc thân gạch.");
    } finally {
      this.loading = false;
    }
  };
}
