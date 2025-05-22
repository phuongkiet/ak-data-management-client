import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { ProductAreaDto } from '../models/product/productArea.model.ts';

export default class AreaStore {
  productAreaList: ProductAreaDto[] = [];
  productAreaRegistry = new Map<number, ProductAreaDto>();
  loading = false;
  term: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setProductAreaList = (list: ProductAreaDto[]) => {
    this.productAreaList = list;
  }

  setTerm = (term: string) => {
    this.term = term;
    this.loadAreas(this.term);
  }

  loadAreas = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductArea.areaList(term);
      runInAction(() => {
        this.productAreaList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productAreaRegistry.clear();
        this.productAreaList.forEach(area => {
          if (area.id != null) this.productAreaRegistry.set(area.id, area);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load area", error);
      toast.error("Lỗi khi tải dữ liệu khu vực.")
    }
  };
}