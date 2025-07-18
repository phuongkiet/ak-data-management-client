import {
  ProductSupplierDto,
  AddSupplierDto,
  UpdateSupplierForStrategyDto,
  SupplierDetailDto,
} from "../models/product/productSupplier.model.ts";
import { makeObservable, observable, action, runInAction, computed } from "mobx";
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
  tempList: ProductSupplierDto[] = [];
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
    supplierCombinedCode: "",
  };

  supplierDetail: SupplierDetailDto = {} as SupplierDetailDto;

  supplierFormDetail: UpdateSupplierForStrategyDto =
    {} as UpdateSupplierForStrategyDto;

  get displayList() {
    return this.term ? this.tempList : this.productSupplierList;
  }

  constructor() {
    super();
    makeObservable(this, {
      productSupplierList: observable,
      productSupplierRegistry: observable,
      tempList: observable,
      displayList: computed,
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
        supplierCombinedCode: "",
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
      this.updateMetadataInLocalStorage(list);
    });
  };

  setTerm = (term: string) => {
    this.term = term;
  }

  searchSupplier = async () => {
    await this.loadSuppliers(this.term);
  };

  loadAllSuppliers = async () => {
    await this.loadSuppliers();
  }

  clearSearch = () => {
    this.term = "";
    this.tempList = [];
  }

  loadSuppliers = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.ProductSupplier.supplierList(term);
      runInAction(() => {
        if (term) {
          // Nếu có term (search), lưu vào tempList
          this.tempList = result.data || [];
        } else {
          // Nếu không có term, load toàn bộ vào productSupplierList
          this.productSupplierList = result.data || [];
          // Cập nhật registry
          this.productSupplierRegistry.clear();
          this.productSupplierList.forEach(supplier => {
            if (supplier.id != null) this.productSupplierRegistry.set(supplier.id, supplier);
          });
        }
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
        supplierCombinedCode: "",
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
          const newItem: ProductSupplierDto = {
            id: Date.now(),
            supplierName: this.supplierForm.supplierName,
            supplierCodeName: this.supplierForm.supplierCodeName,
            supplierShortCode: this.supplierForm.supplierShortCode,
            supplierCombinedCode: this.supplierForm.supplierCombinedCode,
            shippingFee: null,
            discount: null,
            taxId: null,
          };
          this.addItemToMetadata(newItem);
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
          this.orderNumber = response.data?.supplierNextOrder || 0;
          this.supplierForm.supplierCombinedCode = response.data?.supplierNextCombinedCode || "";
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
      runInAction(() => {
        this.supplierFormDetail = {
          taxId: result.data?.taxId ?? null,
          supplierFactories: result.data?.supplierFactories ?? [],
          productServices: result.data?.productServices ?? null,
          supplierName: result.data?.supplierName ?? "",
          supplierCodeName: result.data?.supplierCodeName ?? "",
          supplierShortCode: result.data?.supplierShortCode ?? "",
          supplierCombinedCode: result.data?.supplierCombinedCode ?? "",
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
          this.loadAllSuppliers(); // Reload toàn bộ list
          this.resetSupplierForm();
          const updatedItem: ProductSupplierDto = {
            id: id,
            supplierName: this.supplierFormDetail.supplierName,
            supplierCodeName: this.supplierFormDetail.supplierCodeName,
            supplierShortCode: this.supplierFormDetail.supplierShortCode,
            supplierCombinedCode: this.supplierFormDetail.supplierCombinedCode,
            shippingFee: this.supplierFormDetail.shippingFee ?? null,
            discount: this.supplierFormDetail.discount ?? null,
            taxId: this.supplierFormDetail.taxId ?? null,
          };
          this.addItemToMetadata(updatedItem);
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

  private updateMetadataInLocalStorage = (supplierList: ProductSupplierDto[]) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productSupplierDtos = supplierList;
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }

  private addItemToMetadata = (newItem: ProductSupplierDto) => {
    const currentMetadata = OfflineStorage.getMetadata();
    if (currentMetadata) {
      currentMetadata.productSupplierDtos.push(newItem);
      OfflineStorage.saveMetadata(currentMetadata);
    }
  }   

  // private removeItemFromMetadata = (id: number) => {
  //   const currentMetadata = OfflineStorage.getMetadata();
  //   if (currentMetadata) {
  //     currentMetadata.productSupplierDtos = currentMetadata.productSupplierDtos.filter(
  //       item => item.id !== id
  //     );
  //     OfflineStorage.saveMetadata(currentMetadata);
  //   }
  // }
}
