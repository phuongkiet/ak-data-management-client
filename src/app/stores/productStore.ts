import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import {
  AddProductDto,
  EditProductDto,
  ProductDetail,
  ProductDto,
  StrategyProductDto,
  StrategyProductDetailDto,
  SupplierSizeCombinationDto,
  ProductMetadataDto,
  EditBulkStrategyProductDto,
  EditStrategyProductDto,
} from "../models/product/product.model";
import { toast } from "react-toastify";
import { UploadWebsiteStatus } from "../models/product/enum/product.enum.ts";
import { AdvancedSearchDto } from "../models/common/advancedSearch.model";
import { store } from "../stores/store";

export default class ProductStore {
  //Product
  productRegistry = new Map<number, ProductDto>();
  strategyProductRegistry = new Map<number, StrategyProductDto>();
  productList: ProductDto[] = [];
  strategyProductList: StrategyProductDto[] = [];
  productMetadata: ProductMetadataDto = {} as ProductMetadataDto;
  loading = false;
  totalPages = 0;
  totalCount = 0;
  absoluteTotalCount = 0;
  pageNumber = 1;
  pageSize = 10;
  term: string | null = null;
  supplierId: number | null = null;
  sizeId: number | null = null;

  productForm: AddProductDto = {} as AddProductDto;
  productDetail: ProductDetail = {} as ProductDetail;
  strategyProductDetail: StrategyProductDetailDto = {} as StrategyProductDetailDto;
  strategyProductForm: EditStrategyProductDto = {} as EditStrategyProductDto;

  existingSupplierSizeCombinations: SupplierSizeCombinationDto[] = [];
  loadingCombinations = false;

  // Bulk update strategy products
  bulkUpdateStrategyProductsLoading = false;
  bulkUpdateStrategyProducts = async (dto: EditBulkStrategyProductDto) => {
    this.bulkUpdateStrategyProductsLoading = true;
    const result = await agent.Product.editBulkStrategyProduct(dto);
    try {
      runInAction(() => {
        this.bulkUpdateStrategyProductsLoading = false;
        toast.success(result.data);
        // Reload lại danh sách sản phẩm sau khi cập nhật
        this.loadStrategyProducts(this.pageSize, this.pageNumber, this.term ?? undefined);
        return true;
      });
    } catch (error) {
      runInAction(() => {
        this.bulkUpdateStrategyProductsLoading = false;
        toast.error(result.errors?.[0] || "Cập nhật giá hàng loạt thất bại!");
        return false;
      });
    }
  };

  resetProductForm = () => {
    runInAction(() => {
      this.productForm = {
        originCountryId: null,
        actualSizeId: null,
        brickPatternId: null,
        colorId: null,
        surfaceFeatureId: null,
        materialId: null,
        brickBodyId: null,
        storageId: null,
        antiSlipId: null,
        supplierId: null,
        companyCodeId: null,
        processingId: null,
        waterAbsorptionId: null,
        taxId: null,
        calculatedUnitId: null,
        productFactoryId: null,

        priceDetermination: 2,
        noticeDataWebsite: 2,
        uploadWebsiteStatus: UploadWebsiteStatus.NotCaptured,
        discountConditions: 0,
        secondDiscountConditions: 0,

        supplierItemCode: "",
        supplerCode: "",
        productOrderNumber: undefined,
        productCode: "",
        autoBarCode: "",
        displayWebsiteName: "",
        webProductPrice: null,
        webDiscountedPrice: null,
        secondWebDiscountedPrice: null,
        autoCalculatedUnit: "",
        calculatedUnit: "",
        productSpecialNote: "",
        diameterSize: undefined,
        thicknessSize: 0,
        weightPerUnit: 0,
        weightPerBox: 0,
        quantityPerBox: 0,
        porcelainWarrantyPeriod: undefined,
        accessoryWarrantyPeriod: undefined,
        patternQuantity: 0,
        isInside: true,
        isOutside: true,
        isFlooring: true,
        isWalling: true,
        isCOCQ: true,
        isScratchResist: true,
        isAntiFouling: true,
        isEdgeGrinding: true,
        hardnessMOHS: 0,
        otherNote: "",
        deliveryEstimatedDate: "",
      };
    });
  };

  constructor() {
    makeAutoObservable(this);
    this.resetProductForm();
    // Set mặc định cho form chiến lược khi khởi tạo
    if (!this.strategyProductForm || Object.keys(this.strategyProductForm).length === 0) {
      this.strategyProductForm = {
        listPrice: null,
        supplierRisingPrice: null,
        otherPriceByCompany: null,
        shippingFee: null,
        discount: null,
        policyStandard: 76,
        supplierDiscountCash: null,
        supplierDiscountPercentage: null,
        firstPolicyStandardAfterDiscount: 5,
        secondPolicyStandardAfterDiscount: 5,
        taxId: null,
        quantityPerBox: null,
        weightPerUnit: null,
      };
    }

    const savedPageNumber = localStorage.getItem("pageNumber");
    const savedPageSize = localStorage.getItem("pageSize");

    this.pageNumber = savedPageNumber ? parseInt(savedPageNumber) : 1;
    this.pageSize = savedPageSize ? parseInt(savedPageSize) : 10;
  }

  initialize = async () => {
    if (!store.commonStore.token) return;
    
    try {
      await this.getTotalProducts();
      // await this.loadExistingSupplierSizeCombinations();
    } catch (error) {
      console.error("Failed to initialize product store:", error);
    }
  }

  setSupplierId = (id: number | null) => {
    this.supplierId = id;
  };

  setSizeId = (id: number | null) => {
    this.sizeId = id;
  };

  setPageNumber = (page: number) => {
    this.pageNumber = page;
    localStorage.setItem("pageNumber", page.toString());
  };

  setPageSize = (size: number) => {
    this.pageSize = size;
    this.pageNumber = 1;
    localStorage.setItem("pageSize", size.toString());
    localStorage.setItem("pageNumber", "1");
  };

  setTerm = (term: string) => {
    this.term = term;
    this.pageNumber = 1;
  };

  setFilters = (filters: Partial<AdvancedSearchDto>) => {
    runInAction(() => {
      // Sử dụng runInAction để cập nhật nhiều observable
      if (filters.pageNumber !== undefined)
        this.pageNumber = filters.pageNumber;
      if (filters.pageSize !== undefined) this.pageSize = filters.pageSize;
      if (filters.term !== undefined) this.term = filters.term;
      if (filters.supplierId !== undefined)
        this.supplierId = filters.supplierId;
      if (filters.sizeId !== undefined) this.sizeId = filters.sizeId;
    });
  };

  loadProducts = async () => {
    this.loading = true;
    try {
      const result = await agent.Product.productList(
        this.pageSize,
        this.pageNumber,
        this.term ?? undefined,
        this.supplierId ?? undefined,
        this.sizeId ?? undefined
      );
      runInAction(() => {
        this.productList = result.data?.results || [];
        this.totalPages = result.data?.totalPage || 0;
        this.totalCount = result.data?.totalItems || 0;
        this.loading = false;
        this.productRegistry.clear();
        this.productList.forEach((product) => {
          if (product.id != null) this.productRegistry.set(product.id, product);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load products", error);
      toast.error("Lỗi khi tải dữ liệu sản phẩm.");
    }
  };

  loadExistingSupplierSizeCombinations = async () => {
    this.loadingCombinations = true;
    try {
      // Gọi API endpoint mới (cần được implement ở backend)
      const response = await agent.Product.getExistingSupplierSizeCombinations();
      runInAction(() => {
        this.existingSupplierSizeCombinations = response.data || [];
        this.loadingCombinations = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingCombinations = false;
      });
      console.error("Failed to load supplier-size combinations", error);
      // Có thể hiển thị toast hoặc xử lý lỗi khác tùy ý
    }
  };

  //Strategy Products
  loadStrategyProducts = async (
    pageSize: number,
    pageNumber: number,
    term?: string
  ) => {
    this.loading = true;
    try {
      const result = await agent.Product.strategyProductList(
        pageSize,
        pageNumber,
        term
      );
      console.log(result);
      runInAction(() => {
        this.strategyProductList = result.data?.results || [];
        this.totalPages = result.data?.totalPage || 0;
        this.totalCount = result.data?.totalItems || 0;
        this.loading = false;

        // Optionally: store products in a Map
        this.strategyProductRegistry.clear();
        this.strategyProductList.forEach((product) => {
          if (product.id != null)
            this.strategyProductRegistry.set(product.id, product);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load products", error);
    }
  };

  loadProductDetail = async (id: number) => {
    this.loading = true;
    try {
      const response = await agent.Product.getProductById(id);
      const product = response.data; // Truy xuất `data` từ response

      if (!product) throw new Error("Không có dữ liệu sản phẩm");

      runInAction(() => {
        this.productDetail = {
          ...{
            ...product,
          },
        };
        console.log(this.productDetail);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Lỗi khi tải sản phẩm", error);
      toast.error("Không thể tải dữ liệu sản phẩm");
    }
  };

  loadStrategyProductDetail = async (id: number) => {
    this.loading = true;
    try {
      const response = await agent.Product.getStrategyProductById(id);
      const product = response.data; // Truy xuất `data` từ response

      if (!product) throw new Error("Không có dữ liệu sản phẩm");

      runInAction(() => {
        this.calculateStrategyProductFields(product);
        this.strategyProductDetail = {
          ...{
            ...product,
          },
        };
        console.log(this.strategyProductDetail);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Lỗi khi tải sản phẩm", error);
      toast.error("Không thể tải dữ liệu sản phẩm");
    }
  };

  updateProductForm = <K extends keyof AddProductDto>(
    field: K,
    value: AddProductDto[K]
  ) => {
    runInAction(() => {
      this.productForm[field] = value;
      console.log(this.productForm);
    });
  };

  //Supplier
  getNextOrderNumberAuto = async () => {
    try {
      if (!this.productForm.supplierId) {
        return; // Return early if no supplierId
      }
      const response = await agent.Product.getNextOrderNumber(
        this.productForm.supplierId
      );
      runInAction(() => {
        if (response.data) {
          this.productForm.productOrderNumber = response.data;
        } else {
          toast.error(response.errors || "Không lấy được số thứ tự.");
        }
      });
    } catch (error) {
      console.error("Error getting next order number:", error);
      this.productForm.productOrderNumber = 0; // fallback
    }
  };

  createProduct = async () => {
    this.loading = true;
    try {
      const response = await agent.Product.addNewProduct(this.productForm);
      if (response.data) {
        runInAction(() => {
          toast.success(response.data);
          this.resetProductForm();
          this.loadProducts();
        });
        return response.data;
      } else {
        runInAction(() => {
          toast.error(response.errors?.[0] || "Có lỗi xảy ra khi tạo sản phẩm");
        });
        return null;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Error creating product:", error);
      toast.error("Có lỗi xảy ra khi tạo sản phẩm");
      return null;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  getTotalProducts = async () => {
    try {
      const response = await agent.Product.getTotalProducts();
      runInAction(() => {
        if (response.success) {
          this.absoluteTotalCount = response.data || 0;
        } else {
          toast.error(
            response.errors?.[0] || "Không lấy được tổng số sản phẩm"
          );
        }
      });
    } catch (error) {
      console.error("Error getting total products:", error);
    }
  };

  checkSupplierItemCode = async (supplierItemCode: string) => {
    try {
      const response = await agent.Product.checkSupplierItemCode(
        supplierItemCode
      );
      return response.data;
    } catch (error) {
      console.error("Error checking SKU:", error);
    }
  };

  importProducts = async (file: File) => {
    this.loading = true;
    try {
      const response = await agent.Product.importProducts(file);
      if (response.success) {
        runInAction(() => {
          toast.success(`Đã nhập ${response.data} sản phẩm thành công.`);
          this.loadProducts(); // Reload the product list after import
        });
      } else {
        runInAction(() => {
          toast.error(response.errors?.[0] || "Lỗi khi nhập sản phẩm");
        });
      }
    } catch (error) {
      console.error("Error importing products:", error);
      toast.error("Lỗi khi nhập sản phẩm");
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  editProduct = async (productId: number, product: EditProductDto) => {
    this.loading = true;
    try {
      //Hardcode discount conditions
      product.discountConditions = 0;
      product.secondDiscountConditions = 0;
      const response = await agent.Product.editProduct(productId, product);
      if (response.success) {
        runInAction(() => {
          toast.success(response.data);
          this.loadProducts();
          this.loading = false;
        });
        return true;
      } else {
        runInAction(() => {
          toast.error(response.errors?.[0] || "Lỗi khi sửa sản phẩm");
          this.loading = false;
        });
        return false;
      }
    } catch (error) {
      console.error("Error editing product:", error);
      toast.error("Lỗi khi sửa sản phẩm");
      return false;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateStrategyProductForm = <K extends keyof EditStrategyProductDto>(
    field: K,
    value: EditStrategyProductDto[K]
  ) => {
    runInAction(() => {
      // Chỉ cập nhật form với các field có thể edit
      this.strategyProductForm[field] = value;
      console.log(this.strategyProductForm.quantityPerBox);
    });
  };

  // Tách riêng logic tính toán
  calculateStrategyProductFields(product: StrategyProductDetailDto) {
    console.log('Starting calculation with product:', product);

    // 1. ConfirmListPrice
    const listPrice = Number(product.listPrice) || 0;
    const supplierRisingPrice = Number(product.supplierRisingPrice) || 0;
    const otherPriceByCompany = Number(product.otherPriceByCompany) || 0;
    const quantityPerBox = Number(product.quantityPerBox) || 0;
    const confirmListPrice = listPrice + supplierRisingPrice + (otherPriceByCompany * quantityPerBox);
    product.confirmListPrice = confirmListPrice;

    // 2. SupplierEstimatedPayableAmount
    const discountPercentage = Number(product.discount) / 100 || 0;
    const shippingFee = Number(product.shippingFee) || 0;
    const taxRateNumber = Number(product.taxRateNumber) || 1;
    
    // Tính giá sau chiết khấu
    const priceAfterDiscount = confirmListPrice * (1 - discountPercentage);
    
    // Áp dụng thuế cho giá sau chiết khấu
    let priceAfterTax = priceAfterDiscount;
    if (product.taxId === 1 || product.taxId === 2) {
      priceAfterTax = priceAfterDiscount * taxRateNumber;
    }
    
    // Cộng phí vận chuyển vào sau khi đã tính thuế
    const supplierEstimatedPayableAmount = priceAfterTax + shippingFee;
    product.supplierEstimatedPayableAmount = Math.round(supplierEstimatedPayableAmount / 1000) * 1000;

    // 3. RetailPrice
    const policyStandard = Number(product.policyStandardNumber) || 0;
    const policyStandardNumber = 1 + policyStandard / 100;
    let rawRetailPrice = supplierEstimatedPayableAmount * policyStandardNumber;
    product.retailPrice = listPrice > 0 ? Math.round(rawRetailPrice / 1000) * 1000 : 0;

    // 4. EstimatedPurchasePriceAfterSupplierDiscount
    const supplierDiscountPercentage = Number(product.supplierDiscountPercentage) / 100 || 0;
    const supplierDiscountCash = Number(product.supplierDiscountCash) || 0;
    product.estimatedPurchasePriceAfterSupplierDiscount = supplierEstimatedPayableAmount * (1 - supplierDiscountPercentage) - supplierDiscountCash;

    // 5. First Remaining Price After Discount
    const firstPolicyStandardAfterDiscount = Number(product.firstPolicyStandardAfterDiscount) || 0;
    const firstPolicyStandardNumber = firstPolicyStandardAfterDiscount / 100;
    product.firstRemainingPriceAfterDiscount = Math.round((product.retailPrice - (product.retailPrice * firstPolicyStandardNumber)) / 1000) * 1000;

    // 6. First Fixed Policy Price
    product.firstFixedPolicyPrice = Math.round((product.firstRemainingPriceAfterDiscount * 0.4) / 1000) * 1000;

    // 7. First Actual Received Price
    product.firstActualReceivedPriceAfterPolicyDiscount = Math.round((product.firstRemainingPriceAfterDiscount - product.firstFixedPolicyPrice) / 1000) * 1000;

    // 8. Second Remaining Price After Discount
    const secondPolicyStandardAfterDiscount = Number(product.secondPolicyStandardAfterDiscount) || 0;
    const secondPolicyStandardNumber = secondPolicyStandardAfterDiscount / 100;
    product.secondRemainingPriceAfterDiscount = Math.round((product.retailPrice - (product.retailPrice * secondPolicyStandardNumber)) / 1000) * 1000;

    // 9. Second Fixed Policy Price
    product.secondFixedPolicyPrice = Math.round((product.secondRemainingPriceAfterDiscount * 0.4) / 1000) * 1000;

    // 10. Second Actual Received Price
    product.secondActualReceivedPriceAfterPolicyDiscount = Math.round((product.secondRemainingPriceAfterDiscount - product.secondFixedPolicyPrice) / 1000) * 1000;

    // === Web Prices ===
    function calculateWebPriceValue(
      basePrice: number,
      unitName: string,
      currentQuantity: number,
      currentAreaPerUnit: number
    ): number {
      if (!currentQuantity) return 0;
      let calculatedValue = 0;
      if (unitName === "THÙNG") {
        calculatedValue = basePrice / currentQuantity;
      } else if (unitName === "M2") {
        calculatedValue = basePrice * currentAreaPerUnit;
      } else if (currentAreaPerUnit > 0) {
        calculatedValue = basePrice * currentAreaPerUnit;
      } else if (currentAreaPerUnit === 0) {
        calculatedValue = basePrice * currentQuantity;
      } else {
        return 0;
      }
      return Math.round(calculatedValue / 1000) * 1000;
    }
    const calculatedUnitName = product.calculatedUnit ?? "";
    const areaPerUnit = Number(product.area) || 0;
    const quantity = Number(product.quantityPerBox) || 0;
    product.webProductPrice = calculateWebPriceValue(
      product.retailPrice ?? 0,
      calculatedUnitName,
      quantity,
      areaPerUnit
    );
    product.webDiscountedPrice = calculateWebPriceValue(
      product.firstRemainingPriceAfterDiscount ?? 0,
      calculatedUnitName,
      quantity,
      areaPerUnit
    );
    product.webSecondDiscountedPrice = calculateWebPriceValue(
      product.secondRemainingPriceAfterDiscount ?? 0,
      calculatedUnitName,
      quantity,
      areaPerUnit
    );
    // Gán lại object để các component observer tự động nhận giá trị mới
    this.strategyProductDetail = { ...product };

    console.log('Final calculated product:', product);
  };

  editStrategyProduct = async (productId: number, product: EditStrategyProductDto) => {
    this.loading = true;
    try {
      const response = await agent.Product.editStrategyProduct(productId, product);
      if (response.success) {
        runInAction(() => {
          toast.success(response.data);
          // Sau khi lưu thành công, load lại detail để lấy các giá trị được tính toán từ backend
          this.loadStrategyProductDetail(productId);
          this.loadStrategyProducts(this.pageSize, this.pageNumber, this.term ?? undefined);
          this.loading = false;
        });
        return true;
      } else {
        runInAction(() => {
          toast.error(response.errors?.[0] || "Lỗi khi sửa sản phẩm chiến lược");
          this.loading = false;
        });
        return false;
      }
    } catch (error) {
      console.error("Error editing strategy product:", error);
      toast.error("Lỗi khi sửa sản phẩm chiến lược");
      return false;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  getProductMetadata = async () => {
    try {
      const response = await agent.Product.getProductMetadata();
      runInAction(() => {
        this.productMetadata = response.data || {} as ProductMetadataDto;
      });
    } catch (error) {
      console.error("Error getting product metadata:", error);
    }
  };
}

