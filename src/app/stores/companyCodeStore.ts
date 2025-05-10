import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { AddCompanyCodeDto, CompanyCodeDto } from '../models/product/companyCode.model.ts'

export default class CompanyCodeStore {
  productCompanyCodeList: CompanyCodeDto[] = [];
  productCompanyCodeRegistry = new Map<number, CompanyCodeDto>();
  loading = false;

  companyCodeForm: AddCompanyCodeDto = {
    codeName: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  loadCompanyCodes = async () => {
    this.loading = true;
    try {
      const result = await agent.CompanyCode.companyCodeList();
      console.log(result);
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
}