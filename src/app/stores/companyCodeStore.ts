import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { CompanyCodeDto } from '../models/product/companyCode.model.ts'

export default class CompanyCodeStore {
  productCompanyCodeList: CompanyCodeDto[] = [];
  productCompanyCodeRegistry = new Map<number, CompanyCodeDto>();
  loading = false;

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
}