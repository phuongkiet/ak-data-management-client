import { action, makeObservable, observable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddCalculatedUnitDto, CalculatedUnitDto, UpdateCalculatedUnitDto } from '../models/product/calculatedUnit.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class CalculatedUnitStore extends BaseStore {
  productCalculatedUnitList: CalculatedUnitDto[] = [];
  productCalculatedUnitRegistry = new Map<number, CalculatedUnitDto>();
  loading = false;
  term: string = '';

  calculatedUnitForm: AddCalculatedUnitDto = {
    calculatedUnitName: "",
    autoCalculatedUnitName: "",
  };

  calculatedUnitFormUpdate: UpdateCalculatedUnitDto = {
    calculatedUnitName: "",
    autoCalculatedUnitName: "",
  };

  constructor() {
    super();
    makeObservable(this, {
      productCalculatedUnitList: observable,
      productCalculatedUnitRegistry: observable,
      loading: observable,
      term: observable,
      calculatedUnitForm: observable,
      calculatedUnitFormUpdate: observable,
      setProductCalculatedUnitList: action,
      setTerm: action,
      loadCalculatedUnits: action,
      resetCalculatedUnitForm: action,
      addCalculatedUnit: action,
      updateCalculatedUnit: action,
      updateCalculatedUnitFormUpdate: action,
    });
  }

  setProductCalculatedUnitList = (list: CalculatedUnitDto[]) => {
    this.productCalculatedUnitList = list;
    this.productCalculatedUnitRegistry.clear();
    list.forEach((calculatedUnit) => {
      if (calculatedUnit.id != null)
        this.productCalculatedUnitRegistry.set(calculatedUnit.id, calculatedUnit);
    });
    // Update metadata in localStorage
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.calculatedUnitDtos = list;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  setTerm = (term: string) => {
    this.term = term;
    this.loadCalculatedUnits(this.term);
  }

  loadCalculatedUnits = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.CalculatedUnit.calculatedUnitList(term);
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

  resetCalculatedUnitForm = () => {
    this.calculatedUnitForm = {
      calculatedUnitName: "",
      autoCalculatedUnitName: "",
    };
  }

  addCalculatedUnit = async () => {
    this.loading = true;
    try {
      const result = await agent.CalculatedUnit.addCalculatedUnit(this.calculatedUnitForm);
      if (result.success) {
        toast.success("Thêm đơn vị tính thành công.");
        this.loadCalculatedUnits();
        this.resetCalculatedUnitForm();
        this.loading = false;
        return true;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateCalculatedUnit = async () => {
    this.loading = true;
    try {
      const result = await agent.CalculatedUnit.updateCalculatedUnit(this.calculatedUnitFormUpdate);
      if (result.success) {
        toast.success("Cập nhật đơn vị tính thành công.");
        this.loadCalculatedUnits();
        this.resetCalculatedUnitForm();
        this.loading = false;
        return true;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateCalculatedUnitFormUpdate = <K extends keyof UpdateCalculatedUnitDto>(field: K, value: UpdateCalculatedUnitDto[K]) => {
    runInAction(() => {
      this.calculatedUnitFormUpdate = {
        ...this.calculatedUnitFormUpdate,
        [field]: value
      };
    });
  }
}