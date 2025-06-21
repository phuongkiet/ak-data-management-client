import { action, makeObservable, observable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddCompanyCodeDto, CompanyCodeDto, UpdateCompanyCodeDto } from '../models/product/companyCode.model.ts'
import BaseStore from './baseStore.ts'
import { OfflineStorage } from '../services/offlineStorage.ts'

export default class CompanyCodeStore extends BaseStore {
  productCompanyCodeList: CompanyCodeDto[] = [];
  productCompanyCodeRegistry = new Map<number, CompanyCodeDto>();
  loading = false;
  term: string = '';

  companyCodeForm: AddCompanyCodeDto = {
    codeName: "",
  };

  companyCodeFormUpdate: UpdateCompanyCodeDto = {
    codeName: "",
  };

  constructor() {
    super();
    makeObservable(this, {
      productCompanyCodeList: observable,
      productCompanyCodeRegistry: observable,
      loading: observable,
      term: observable,
      companyCodeForm: observable,
      companyCodeFormUpdate: observable,
      setProductCompanyCodeList: action,
      setTerm: action,
      loadCompanyCodes: action,
      resetCompanyCodeForm: action,
      updateCompanyCodeForm: action,
      addCompanyCode: action,
      updateCompanyCode: action,
      updateCompanyCodeFormUpdate: action,
      deleteCompanyCode: action,
    });
  }

  setProductCompanyCodeList = (list: CompanyCodeDto[]) => {
    this.productCompanyCodeList = list;
    this.productCompanyCodeRegistry.clear();
    list.forEach((companyCode) => {
      if (companyCode.id != null)
        this.productCompanyCodeRegistry.set(companyCode.id, companyCode);
    });
    this.updateMetadataInLocalStorage(list);
  }

  setTerm = (term: string) => {
    this.term = term;
    this.loadCompanyCodes(this.term);
  }

  searchCompanyCode = async () => {
    await this.loadCompanyCodes(this.term ?? undefined);
  }

  loadCompanyCodes = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.CompanyCode.companyCodeList(term);
      runInAction(() => {
        this.productCompanyCodeList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productCompanyCodeRegistry.clear();
        this.productCompanyCodeList.forEach(companyCode => {
          if (companyCode.id != null) this.productCompanyCodeRegistry.set(companyCode.id, companyCode);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load company code", error);
      toast.error("Lỗi khi tải dữ liệu mã công ty.")
    }
  };

  resetCompanyCodeForm = () => {
    this.companyCodeForm = {
      codeName: "",
    };
  }

  updateCompanyCodeForm = <K extends keyof AddCompanyCodeDto>(field: K, value: AddCompanyCodeDto[K]) => {
    runInAction(() => {
      this.companyCodeForm[field] = value;
    });
  }

  addCompanyCode = async () => {
    this.loading = true;
    try {
      const result = await agent.CompanyCode.addCompanyCode(this.companyCodeForm);
      if (result.success) {
        toast.success("Thêm mã công ty thành công.")
        this.loadCompanyCodes();
        const newItem: CompanyCodeDto = {
          id: Date.now(),
          codeName: this.companyCodeForm.codeName,
        };
        this.addItemToMetadata(newItem);
        this.resetCompanyCodeForm();
        this.loading = false;
        return true;
      }else{
        toast.error("Lỗi khi thêm mã công ty.")
        this.loading = false;
        return false;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to add company code", error);
      toast.error("Lỗi khi thêm mã công ty.")
    }
  }

  updateCompanyCode = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.CompanyCode.updateCompanyCode(id, this.companyCodeFormUpdate);
      if (result.success) {
        toast.success("Cập nhật mã công ty thành công.");
        this.loadCompanyCodes();
        const updatedItem: CompanyCodeDto = {
          id: id,
          codeName: this.companyCodeFormUpdate.codeName,
        };
        this.addItemToMetadata(updatedItem);
        this.resetCompanyCodeForm();
        this.loading = false;
        return true;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateCompanyCodeFormUpdate = <K extends keyof UpdateCompanyCodeDto>(field: K, value: UpdateCompanyCodeDto[K]) => {
    runInAction(() => {
      this.companyCodeFormUpdate = {
        ...this.companyCodeFormUpdate,
        [field]: value
      };
    });
  }

  deleteCompanyCode = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.CompanyCode.deleteCompanyCode(id);
      if (result.success) {
        toast.success(result.data);
        this.loadCompanyCodes();
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

  private updateMetadataInLocalStorage = (companyCodeList: CompanyCodeDto[]) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.companyCodeDtos = companyCodeList;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private addItemToMetadata = (newItem: CompanyCodeDto) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.companyCodeDtos.push(newItem);
      OfflineStorage.saveMetadata(currentMetadata);
    };
  }

  private removeItemFromMetadata = (id: number) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.companyCodeDtos = currentMetadata.companyCodeDtos.filter(item => item.id !== id);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }
}