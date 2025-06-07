import { ProductSupplierDto, AddSupplierDto } from '../models/product/productSupplier.model.ts'
import { makeObservable, observable, action, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { ProductAreaDto } from '../models/product/productArea.model.ts';
import BaseStore from './baseStore';
import { OfflineStorage } from '../services/offlineStorage';

export default class SupplierStore extends BaseStore {
  productSupplierList: ProductSupplierDto[] = [];
  productSupplierRegistry = new Map<number, ProductSupplierDto>();
  loading = false;
  orderNumber = 0;
  term: string = '';
  areaValue: ProductAreaDto = {
    id: 0,
    areaName: '',
    upperName: '',
    shortCode: ''
  };
  supplierForm: AddSupplierDto = {
    supplierName: '',
    supplierCodeName: '',
    supplierShortCode: '',
  };

  constructor() {
    super();
    makeObservable(this, {
      productSupplierList: observable,
      productSupplierRegistry: observable,
      loading: observable,
      orderNumber: observable,
      term: observable,
      areaValue: observable,
      supplierForm: observable,
      setProductSupplierList: action,
      setTerm: action,
      loadSuppliers: action,
      updateSupplierForm: action,
      resetSupplierForm: action,
      addSupplier: action,
      updateAreaValue: action,
      getOrderNumber: action
    });
  }

  setProductSupplierList = (list: ProductSupplierDto[]) => {
    runInAction(() => {
      this.productSupplierList = list;
      this.productSupplierRegistry.clear();
      list.forEach(supplier => {
        if (supplier.id != null) this.productSupplierRegistry.set(supplier.id, supplier);
      });
      
      // Update metadata in localStorage without triggering change notification
      const currentMetadata = OfflineStorage.getMetadata();
      if (currentMetadata) {
        currentMetadata.productSupplierDtos = list;
        OfflineStorage.saveMetadata(currentMetadata);
      }
    });
  }

  setTerm = (term: string) => {
    this.term = term;
    this.loadSuppliers(this.term);
  }

  loadSuppliers = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductSupplier.supplierList(term);
      runInAction(() => {
        this.setProductSupplierList(result.data || []);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load supplier", error);
      toast.error("Lỗi khi tải dữ liệu nhà cung cấp.")
    }
  };

  updateSupplierForm = <K extends keyof AddSupplierDto>(field: K, value: AddSupplierDto[K]) => {
    runInAction(() => {
      this.supplierForm[field] = value;
    });
  };

  resetSupplierForm = () => {
    runInAction(() => {
      this.supplierForm = {
        supplierName: '',
        supplierCodeName: '',
        supplierShortCode: '',
      };
    });
  };

  addSupplier = async () => {
    this.loading = true;
    try {
      const response = await agent.ProductSupplier.addSupplier(this.supplierForm);
      if (response.data) {
        runInAction(() => {
          toast.success(response.data);
          this.resetSupplierForm();
          // Load suppliers and update metadata
          this.loadSuppliers();
        });
        return true;
      } else {
        toast.error(response.errors?.[0] || 'Có lỗi xảy ra khi tạo nhà cung cấp');
        return false;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error('Error creating supplier:', error);
      toast.error('Có lỗi xảy ra khi tạo nhà cung cấp');
      return false;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateAreaValue = <K extends keyof ProductAreaDto>(field: K, value: ProductAreaDto[K]) => {
    runInAction(() => {
      this.areaValue[field] = value;
    });
  };

  getOrderNumber = async (term: string) => {
    this.loading = true;
    try {
      const response = await agent.ProductSupplier.getNextSupplierOrderNumber(term);
      if (response.data !== undefined) {
        runInAction(() => {
          this.orderNumber = response.data || 0;
        });
      } else {
        toast.error(response.errors?.[0] || 'Có lỗi xảy ra khi lấy thứ tự của mã nhà cung cấp');
        return null;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error('Error get supplier order:', error);
      toast.error('Có lỗi xảy ra khi lấy thứ tự của mã nhà cung cấp');
      return null;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}