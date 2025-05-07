import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { CalculatedUnitDto } from '../models/product/calculatedUnit.model.ts'

export default class CalculatedUnitStore {
  productCalculatedUnitList: CalculatedUnitDto[] = [];
  productCalculatedUnitRegistry = new Map<number, CalculatedUnitDto>();
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadCalculatedUnits = async () => {
    this.loading = true;
    try {
      const result = await agent.CalculatedUnit.calculatedUnitList();
      console.log(result);
      runInAction(() => {
        this.productCalculatedUnitList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productCalculatedUnitRegistry.clear();
        this.productCalculatedUnitList.forEach(calculatedUnit => {
          if (calculatedUnit.id != null) this.productCalculatedUnitRegistry.set(calculatedUnit.id, calculatedUnit);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load calculated unit", error);
      toast.error("Lỗi khi tải dữ liệu đơn vị tính.")
    }
  };
}