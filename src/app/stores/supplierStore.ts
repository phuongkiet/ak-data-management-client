import { ProductSupplierDto, AddSupplierDto } from '../models/product/productSupplier.model.ts'
import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { ProductAreaDto } from '../models/product/productArea.model.ts';

export default class SupplierStore {
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
    formula: ''
  };

  constructor() {
    makeAutoObservable(this);
  }

  setTerm = (term: string) => {
    this.term = term;
    this.loadSuppliers(this.term);
  }

  loadSuppliers = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductSupplier.supplierList(term);
      console.log(result);
      runInAction(() => {
        this.productSupplierList = result.data || [];
        this.loading = false;

        // Optionally: store suppliers in a Map
        this.productSupplierRegistry.clear();
        this.productSupplierList.forEach(supplier => {
          if (supplier.id != null) this.productSupplierRegistry.set(supplier.id, supplier);
        });
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
        formula: ''
      };
    });
  };

  addSupplier = async () => {
    this.loading = true;
    try {
      const response = await agent.ProductSupplier.addSupplier(this.supplierForm);
      if (response.data) {
        toast.success(response.data);
        this.resetSupplierForm();
        await this.loadSuppliers();
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
    console.log('Updating area value:', field, value);
    runInAction(() => {
      this.areaValue[field] = value;
      console.log('Updated area value:', this.areaValue);
    });
  };

  getOrderNumber = async (term: string) => {
    console.log('Getting order number for term:', term);
    this.loading = true;
    try {
      const response = await agent.ProductSupplier.getNextSupplierOrderNumber(term);
      console.log('Order number response:', response);
      if (response.data !== undefined) {
        runInAction(() => {
          this.orderNumber = response.data || 0;
          console.log('Updated order number:', this.orderNumber);
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