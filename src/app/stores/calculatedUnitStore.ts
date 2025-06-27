import { action, makeObservable, observable, runInAction, computed } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddCalculatedUnitDto, CalculatedUnitDto, UpdateCalculatedUnitDto } from '../models/product/calculatedUnit.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class CalculatedUnitStore extends BaseStore {
  productCalculatedUnitList: CalculatedUnitDto[] = [];
  productCalculatedUnitRegistry = new Map<number, CalculatedUnitDto>();
  tempList: CalculatedUnitDto[] = [];
  loading = false;
  term: string = '';

  get displayList() {
    return this.term ? this.tempList : this.productCalculatedUnitList;
  }

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
      tempList: observable,
      displayList: computed,
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
      setCalculatedUnitFormUpdate: action,
      updateCalculatedUnitForm: action,
      deleteCalculatedUnit: action,
    });
  }

  setProductCalculatedUnitList = (list: CalculatedUnitDto[]) => {
    this.productCalculatedUnitList = list;
    this.productCalculatedUnitRegistry.clear();
    list.forEach((calculatedUnit) => {
      if (calculatedUnit.id != null)
        this.productCalculatedUnitRegistry.set(calculatedUnit.id, calculatedUnit);
    });
    this.updateMetadataInLocalStorage(list);
  }

  setTerm = (term: string) => {
    this.term = term;
    // Không tự động gọi search nữa, chỉ lưu term
  }

  searchCalculatedUnit = async () => {
    await this.loadCalculatedUnits(this.term);
  }

  loadAllCalculatedUnits = async () => {
    await this.loadCalculatedUnits();
  }

  clearSearch = () => {
    this.term = "";
    this.tempList = [];
  }

  loadCalculatedUnits = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.CalculatedUnit.calculatedUnitList(term);
      runInAction(() => {
        if (term) {
          // Nếu có term (search), lưu vào tempList
          this.tempList = result.data || [];
        } else {
          // Nếu không có term, load toàn bộ vào productCalculatedUnitList
          this.productCalculatedUnitList = result.data || [];
          // Cập nhật registry
          this.productCalculatedUnitRegistry.clear();
          this.productCalculatedUnitList.forEach((calculatedUnit) => {
            if (calculatedUnit.id != null)
              this.productCalculatedUnitRegistry.set(calculatedUnit.id, calculatedUnit);
          });
        }
        this.loading = false;
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
        this.loadAllCalculatedUnits();
        this.resetCalculatedUnitForm();
        const newItem: CalculatedUnitDto = {
          id: Date.now(),
          calculatedUnitName: this.calculatedUnitForm.calculatedUnitName,
          autoCalculatedUnitName: this.calculatedUnitForm.autoCalculatedUnitName,
        };
        this.addItemToMetadata(newItem);
        this.loading = false;
        return true;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateCalculatedUnit = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.CalculatedUnit.updateCalculatedUnit(id, this.calculatedUnitFormUpdate);
      if (result.success) {
        toast.success("Cập nhật đơn vị tính thành công.");
        this.loadAllCalculatedUnits();
        this.resetCalculatedUnitForm();
        const newItem: CalculatedUnitDto = {
          id: Date.now(),
          calculatedUnitName: this.calculatedUnitForm.calculatedUnitName,
          autoCalculatedUnitName: this.calculatedUnitForm.autoCalculatedUnitName,
        };
        this.addItemToMetadata(newItem);
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

  setCalculatedUnitFormUpdate = (data: CalculatedUnitDto) => {
    runInAction(() => {
      this.calculatedUnitFormUpdate = {
        calculatedUnitName: data.calculatedUnitName,
        autoCalculatedUnitName: data.autoCalculatedUnitName,
      };
    });
  }

  updateCalculatedUnitForm = <K extends keyof AddCalculatedUnitDto>(field: K, value: AddCalculatedUnitDto[K]) => {
    runInAction(() => {
      this.calculatedUnitForm = {
        ...this.calculatedUnitForm,
        [field]: value
      };
    });
  }

  deleteCalculatedUnit = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.CalculatedUnit.deleteCalculatedUnit(id);
      if (result.success) {
        toast.success(result.data);
        this.loadAllCalculatedUnits();
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
  };

  private updateMetadataInLocalStorage = (calculatedUnitList: CalculatedUnitDto[]) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.calculatedUnitDtos = calculatedUnitList;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private removeItemFromMetadata = (id: number) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.calculatedUnitDtos = currentMetadata.calculatedUnitDtos.filter(item => item.id !== id);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private addItemToMetadata = (newItem: CalculatedUnitDto) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.calculatedUnitDtos.push(newItem);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }
}