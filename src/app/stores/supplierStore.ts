import {
  ProductSupplierDto,
  AddSupplierDto,
  UpdateSupplierForStrategyDto,
  SupplierDetailDto,
} from "../models/product/productSupplier.model.ts";
import { makeObservable, observable, action, runInAction } from "mobx";
import agent from "../api/agent.ts";
import { toast } from "react-toastify";
import { ProductAreaDto } from "../models/product/productArea.model.ts";
import BaseStore from "./baseStore";
import { OfflineStorage } from "../services/offlineStorage";
import { ProductService } from "../models/product/enum/product.enum.ts";

export default class SupplierStore extends BaseStore {
  productSupplierList: ProductSupplierDto[] = [];
  productSupplierRegistry = new Map<number, ProductSupplierDto>();
  loading = false;
  orderNumber = 0;
  term: string = "";
  areaValue: ProductAreaDto = {
    id: 0,
    areaName: "",
    upperName: "",
    shortCode: "",
  };
  supplierForm: AddSupplierDto = {
    supplierName: "",
    supplierCodeName: "",
    supplierShortCode: "",
  };

  supplierDetail: SupplierDetailDto = {} as SupplierDetailDto;

  supplierFormDetail: UpdateSupplierForStrategyDto =
    {} as UpdateSupplierForStrategyDto;

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
      getOrderNumber: action,
      loadSupplierDetail: action,
      updateSupplierFormDetail: action,
      updateSupplier: action,
      supplierDetail: observable,
      supplierFormDetail: observable,
    });
    if (
      !this.supplierFormDetail ||
      Object.keys(this.supplierFormDetail).length === 0
    ) {
      this.supplierFormDetail = {
        supplierName: "",
        supplierCodeName: "",
        supplierShortCode: "",
        taxId: null,
        supplierFactories: [],
        productServices: ProductService.ReceiveAtStorage,
        shippingFee: null,
        discount: null,
        priceDiscountAtStorage: null,
        percentageOfFastPayment: null,
        amountOfFastPayment: null,
        percentageQuarterlySales: null,
        percentageYearSales: null,
        percentageChangeQuantity: null,
        percentageReturnQuantity: null,
        dateAmountOfChange: null,
        dateAmountOfReturn: null,
        productDocumentation: null,
        startDateOfContract: null,
        endDateOfContract: null,
        remainingDate: null,
        warning: null,
        otherNote: null,
        supplierStorageAddress: null,
        firstContactInfomation: null,
        secondContactInfomation: null,
      };
    }
  }

  setProductSupplierList = (list: ProductSupplierDto[]) => {
    runInAction(() => {
      this.productSupplierList = list;
      this.productSupplierRegistry.clear();
      list.forEach((supplier) => {
        if (supplier.id != null)
          this.productSupplierRegistry.set(supplier.id, supplier);
      });

      // Update metadata in localStorage without triggering change notification
      const currentMetadata = OfflineStorage.getMetadata();
      if (currentMetadata) {
        currentMetadata.productSupplierDtos = list;
        OfflineStorage.saveMetadata(currentMetadata);
      }
    });
  };

  setTerm = (term: string) => {
    this.term = term;
    this.loadSuppliers(this.term);
  };

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
      toast.error("Lỗi khi tải dữ liệu nhà cung cấp.");
    }
  };

  updateSupplierForm = <K extends keyof AddSupplierDto>(
    field: K,
    value: AddSupplierDto[K]
  ) => {
    runInAction(() => {
      this.supplierForm[field] = value;
    });
  };

  resetSupplierForm = () => {
    runInAction(() => {
      this.supplierForm = {
        supplierName: "",
        supplierCodeName: "",
        supplierShortCode: "",
      };
    });
  };

  addSupplier = async () => {
    this.loading = true;
    try {
      const response = await agent.ProductSupplier.addSupplier(
        this.supplierForm
      );
      if (response.data) {
        runInAction(() => {
          toast.success(response.data);
          this.resetSupplierForm();
          // Load suppliers and update metadata
          this.loadSuppliers();
        });
        return true;
      } else {
        toast.error(
          response.errors?.[0] || "Có lỗi xảy ra khi tạo nhà cung cấp"
        );
        return false;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Error creating supplier:", error);
      toast.error("Có lỗi xảy ra khi tạo nhà cung cấp");
      return false;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateAreaValue = <K extends keyof ProductAreaDto>(
    field: K,
    value: ProductAreaDto[K]
  ) => {
    runInAction(() => {
      this.areaValue[field] = value;
    });
  };

  getOrderNumber = async (term: string) => {
    this.loading = true;
    try {
      const response = await agent.ProductSupplier.getNextSupplierOrderNumber(
        term
      );
      if (response.data !== undefined) {
        runInAction(() => {
          this.orderNumber = response.data || 0;
        });
      } else {
        toast.error(
          response.errors?.[0] ||
            "Có lỗi xảy ra khi lấy thứ tự của mã nhà cung cấp"
        );
        return null;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Error get supplier order:", error);
      toast.error("Có lỗi xảy ra khi lấy thứ tự của mã nhà cung cấp");
      return null;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  loadSupplierDetail = async (id: number) => {
    this.loading = true;
    try {
      const result = await agent.ProductSupplier.loadDetail(id);
      console.log("result:", result.data);
      runInAction(() => {
        this.supplierFormDetail = {
          taxId: result.data?.taxId ?? null,
          supplierFactories: result.data?.supplierFactories ?? [],
          productServices: result.data?.productServices ?? null,
          supplierName: result.data?.supplierName ?? "",
          supplierCodeName: result.data?.supplierCodeName ?? "",
          supplierShortCode: result.data?.supplierShortCode ?? "",
          shippingFee: result.data?.shippingFee ?? null,
          discount: result.data?.discount ?? null,
          priceDiscountAtStorage: result.data?.priceDiscountAtStorage ?? null,
          percentageOfFastPayment: result.data?.percentageOfFastPayment ?? null,
          amountOfFastPayment: result.data?.amountOfFastPayment ?? null,
          percentageQuarterlySales:
            result.data?.percentageQuarterlySales ?? null,
          percentageYearSales: result.data?.percentageYearSales ?? null,
          percentageChangeQuantity:
            result.data?.percentageChangeQuantity ?? null,
          percentageReturnQuantity:
            result.data?.percentageReturnQuantity ?? null,
          dateAmountOfChange: result.data?.dateAmountOfChange ?? null,
          dateAmountOfReturn: result.data?.dateAmountOfReturn ?? null,
          productDocumentation: result.data?.productDocumentation ?? null,
          startDateOfContract: result.data?.startDateOfContract ?? null,
          endDateOfContract: result.data?.endDateOfContract ?? null,
          remainingDate: result.data?.remainingDate ?? null,
          warning: result.data?.warning ?? null,
          otherNote: result.data?.otherNote ?? null,
          supplierStorageAddress: result.data?.supplierStorageAddress ?? null,
          firstContactInfomation: result.data?.firstContactInfomation ?? null,
          secondContactInfomation: result.data?.secondContactInfomation ?? null,
        };
        console.log("supplierFormDetail:", this.supplierFormDetail);

        this.supplierDetail = result.data || this.supplierDetail;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load supplier", error);
      toast.error("Lỗi khi tải dữ liệu nhà cung cấp.");
    }
  };

  updateSupplierFormDetail = <K extends keyof UpdateSupplierForStrategyDto>(
    field: K,
    value: UpdateSupplierForStrategyDto[K]
  ) => {
    runInAction(() => {
      this.supplierFormDetail[field] = value;
      console.log("supplierFormDetail:", this.supplierFormDetail);
    });
  };

  updateSupplier = async (id: number) => {
    this.loading = true;
    try {
      const response = await agent.ProductSupplier.updateSupplier(
        id,
        this.supplierFormDetail as UpdateSupplierForStrategyDto
      );
      if (response.data) {
        runInAction(() => {
          toast.success(response.data);
          this.loadSuppliers();
        });
        return true;
      } else {
        toast.error(
          response.errors?.[0] || "Có lỗi xảy ra khi cập nhật nhà cung cấp"
        );
        return false;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Error updating supplier:", error);
      toast.error("Có lỗi xảy ra khi cập nhật nhà cung cấp");
      return false;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
