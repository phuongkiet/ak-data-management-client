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
  CalculateProcessingPriceRequest,
} from "../models/product/product.model";
import { toast } from "react-toastify";
import { UploadWebsiteStatus } from "../models/product/enum/product.enum.ts";
import { AdvancedSearchDto } from "../models/common/advancedSearch.model";
import { OfflineStorage } from "../services/offlineStorage";
import { SyncService } from "../services/syncService";

export default class ProductStore {
  //Product
  productRegistry = new Map<number, ProductDto>();
  strategyProductRegistry = new Map<number, StrategyProductDto>();
  productList: ProductDto[] = [];
  strategyProductList: StrategyProductDto[] = [];
  productMetadata: ProductMetadataDto = {} as ProductMetadataDto;
  loading = false;
  reportGenerationLoading = false;
  totalPages = 0;
  totalCount = 0;
  absoluteTotalCount = 0;
  absoluteTotalPricedCount = 0;
  hasLoadedTotalProducts = false;
  hasLoadedTotalPricedProducts = false;
  pageNumber = 1;
  pageSize = 10;
  term: string | null = null;
  supplierId: number | null = null;
  sizeId: number | null = null;
  uploadWebsiteStatuses: UploadWebsiteStatus[] = [];
  isPriced: boolean | null = null;
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
        this.loadStrategyProducts(this.pageSize, this.pageNumber, this.supplierId ?? undefined, this.sizeId ?? undefined, this.uploadWebsiteStatuses, this.term ?? undefined, this.isPriced ?? undefined);
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
        storageId: 2,
        antiSlipId: 14, 
        supplierId: null,
        companyCodeId: null,
        productProcessingId: null,
        waterAbsorptionId: 2,
        taxId: null,
        calculatedUnitId: 2,
        productFactoryId: null,

        priceDetermination: 2,
        noticeDataWebsite: 2,
        uploadWebsiteStatus: UploadWebsiteStatus.NotCaptured,
        discountConditions: 0,
        secondDiscountConditions: 0,

        supplierItemCode: "",
        confirmSupplierItemCode: "",
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
        thicknessSize: 9,
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
        sapoName: ""
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
        taxRate: null,
        quantityPerBox: null,
        weightPerUnit: null,
      };
    }

    const savedPageNumber = localStorage.getItem("pageNumber");
    const savedPageSize = localStorage.getItem("pageSize");

    this.pageNumber = savedPageNumber ? parseInt(savedPageNumber) : 1;
    this.pageSize = savedPageSize ? parseInt(savedPageSize) : 10;
  }

  setTotalProducts = (total: number) => {
    this.absoluteTotalCount = total;
    this.hasLoadedTotalProducts = true;
  };
  setTotalPricedProducts = (total: number) => {
    this.absoluteTotalPricedCount = total;
    this.hasLoadedTotalPricedProducts = true;
  };

  setSupplierId = (id: number) => {
    this.supplierId = id;
  };

  setSizeId = (id: number) => {
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

  searchProduct = async () => {
    await this.loadProducts();
  };

  setFilters = (filters: Partial<AdvancedSearchDto>) => {
    runInAction(() => {
      if ('pageNumber' in filters) this.pageNumber = filters.pageNumber ?? 1;
      if ('pageSize' in filters) this.pageSize = filters.pageSize ?? 10;
      if ('term' in filters) this.term = filters.term ?? "";
      if ('supplierId' in filters) this.supplierId = filters.supplierId ?? null;
      if ('sizeId' in filters) this.sizeId = filters.sizeId ?? null;
      if ('uploadWebsiteStatuses' in filters) this.uploadWebsiteStatuses = filters.uploadWebsiteStatuses ?? [];
      if ('isPriced' in filters) this.isPriced = filters.isPriced ?? null;
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
        this.sizeId ?? undefined,
        this.uploadWebsiteStatuses,
        this.isPriced ?? undefined
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
    supplierId?: number,
    sizeId?: number,
    uploadWebsiteStatuses?: UploadWebsiteStatus[],
    term?: string,
    isPriced?: boolean
  ) => {
    this.loading = true;
    try {
      const result = await agent.Product.strategyProductList(
        pageSize,
        pageNumber,
        supplierId ?? undefined,
        sizeId ?? undefined,
        uploadWebsiteStatuses,
        isPriced ?? undefined,
        term,
      );
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
      const product = response.data; 

      if (!product) throw new Error("Không có dữ liệu sản phẩm");

      runInAction(() => {
        this.productDetail = {
          ...{
            ...product,
          },
        };
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
        // Set default values for product before calculation
        if (product.policyStandard == null || product.policyStandard === 0) {
          product.policyStandard = 76;
        }
        if (product.firstPolicyStandardAfterDiscount == null || product.firstPolicyStandardAfterDiscount === 0) {
          product.firstPolicyStandardAfterDiscount = 5;
        }
        if (product.secondPolicyStandardAfterDiscount == null || product.secondPolicyStandardAfterDiscount === 0) {
          product.secondPolicyStandardAfterDiscount = 5;
        }

        // Chỉ set lại form nếu form đang rỗng
        const isFormEmpty = Object.values(this.strategyProductForm).every(v => v == null || v === "" || v === 0);
        if (isFormEmpty) {
          this.strategyProductForm = {
            listPrice: product.listPrice ?? null,
            supplierRisingPrice: product.supplierRisingPrice ?? null,
            otherPriceByCompany: product.otherPriceByCompany ?? null,
            shippingFee: product.shippingFee ?? null,
            discount: product.discount ?? null,
            policyStandard: product.policyStandard,
            supplierDiscountCash: product.supplierDiscountCash ?? null,
            supplierDiscountPercentage: product.supplierDiscountPercentage ?? null,
            firstPolicyStandardAfterDiscount: product.firstPolicyStandardAfterDiscount,
            secondPolicyStandardAfterDiscount: product.secondPolicyStandardAfterDiscount,
            taxId: product.taxId ?? null,
            taxRate: product.taxRate ?? null,
            quantityPerBox: product.quantityPerBox ?? null,
            weightPerUnit: product.weightPerUnit ?? null,
          };
        }

        // Chỉ tính lại giá nếu đã có đủ thông tin thuế
        if (product.taxId && product.taxRateNumber) {
          this.calculateStrategyProductFields(product);
        }

        this.strategyProductDetail = { ...product };
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
      // Check if we're online
      if (!SyncService.isOnline()) {
        // Store in offline queue
        const pendingId = OfflineStorage.addPendingProduct(this.productForm);
        runInAction(() => {
          toast.success("Sản phẩm đã được lưu và sẽ được đồng bộ khi có mạng");
          this.resetProductForm();
        });
        return pendingId;
      }

      // If online, proceed with normal creation
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

  checkSupplierItemCode = async (supplierItemCode: string) => {
    try {
      const response = await agent.Product.checkSupplierItemCode(supplierItemCode);
      return response.data;
    } catch (error) {
      console.error("Error checking SKU:", error);
      return false; // Return false on error to indicate invalid code
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
      
      // Tạo một bản sao của strategyProductDetail để tính toán lại
      const updatedProduct = { ...this.strategyProductDetail };
      
      // Cập nhật giá trị mới vào bản sao, chỉ cập nhật các trường có trong form
      if (field in updatedProduct) {
        (updatedProduct as any)[field] = value;
      }
      // Tính toán lại tất cả các giá trị
      this.calculateStrategyProductFields(updatedProduct);

    });
  };

  // Tách riêng logic tính toán
  calculateStrategyProductFields(product: StrategyProductDetailDto) {
    // 1. ConfirmListPrice
    const listPrice = Number(product.listPrice) || 0;
    const supplierRisingPrice = Number(product.supplierRisingPrice) || 0;
    const otherPriceByCompany = Number(product.otherPriceByCompany) || 0;
    const quantityPerBox = Number(product.quantityPerBox) || 0;
    const confirmListPrice = listPrice + supplierRisingPrice + (otherPriceByCompany * quantityPerBox);
    product.confirmListPrice = Math.round(confirmListPrice / 1000) * 1000;

    // 2. SupplierEstimatedPayableAmount
    const discountPercentage = Number(product.discount) / 100 || 0;
    const shippingFee = Number(product.shippingFee) || 0;
    const taxRateNumber = 1 + Number(product.taxRate) / 100 || 1;
    
    // Tính giá sau chiết khấu
    const priceAfterDiscount = confirmListPrice * (1 - discountPercentage) + shippingFee;

    let priceAfterTax = priceAfterDiscount;

    // Áp dụng thuế cho giá sau chiết khấu
    if (product.taxId === 1 || product.taxId === 2) {
      priceAfterTax = priceAfterDiscount * taxRateNumber;
    }

    product.supplierEstimatedPayableAmount = priceAfterTax;    
    // Cộng phí vận chuyển vào sau khi đã tính thuế
    const supplierEstimatedPayableAmount = product.supplierEstimatedPayableAmount;

    // 3. RetailPrice
    const policyStandard = Number(product.policyStandard) || 0;
    const policyStandardNumber = 1 + policyStandard / 100;
    const rawRetailPrice = supplierEstimatedPayableAmount * policyStandardNumber;
    product.retailPrice = listPrice > 0 ? Math.round(rawRetailPrice / 1000) * 1000 : 0;

    // 4. EstimatedPurchasePriceAfterSupplierDiscount
    const supplierDiscountPercentage = Number(product.supplierDiscountPercentage) / 100 || 0;
    const supplierDiscountCash = Number(product.supplierDiscountCash) || 0;
    const estimatedPurchasePrice = supplierEstimatedPayableAmount * (1 - supplierDiscountPercentage) - supplierDiscountCash;
    product.estimatedPurchasePriceAfterSupplierDiscount = estimatedPurchasePrice;

    // 5. First Remaining Price After Discount
    const firstPolicyStandardAfterDiscount = Number(product.firstPolicyStandardAfterDiscount) || 0;
    const firstPolicyStandardNumber = firstPolicyStandardAfterDiscount / 100;
    product.firstRemainingPriceAfterDiscount = (product.retailPrice - (product.retailPrice * firstPolicyStandardNumber));

    // 6. First Fixed Policy Price
    product.firstFixedPolicyPrice = (product.firstRemainingPriceAfterDiscount * 0.4);

    // 7. First Actual Received Price
    product.firstActualReceivedPriceAfterPolicyDiscount = (product.firstRemainingPriceAfterDiscount - product.firstFixedPolicyPrice);

    // 8. Second Remaining Price After Discount
    const secondPolicyStandardAfterDiscount = Number(product.secondPolicyStandardAfterDiscount) || 0;
    const secondPolicyStandardNumber = secondPolicyStandardAfterDiscount / 100;
    product.secondRemainingPriceAfterDiscount = (product.retailPrice - (product.retailPrice * secondPolicyStandardNumber));

    // 9. Second Fixed Policy Price
    product.secondFixedPolicyPrice = (product.secondRemainingPriceAfterDiscount * 0.4);

    // 10. Second Actual Received Price
    product.secondActualReceivedPriceAfterPolicyDiscount = (product.secondRemainingPriceAfterDiscount - product.secondFixedPolicyPrice);

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
          this.loadStrategyProducts(this.pageSize, this.pageNumber, this.supplierId ?? undefined, this.sizeId ?? undefined, this.uploadWebsiteStatuses, this.term ?? undefined);
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

  calculateProcessingPrice = async (dto: CalculateProcessingPriceRequest) => {
    try {
      const response = await agent.Product.calculateProcessingPrice(dto);
      if(response.success) {
        return response.data;
      } else {
        toast.error(response.errors?.[0] || "Lỗi khi tính toán giá gia công");
        return null;
      }
    } catch (error) {
      console.error("Error calculating processing price:", error);
      toast.error("Lỗi khi tính toán giá gia công");
      return null;
    }
  };

  updateBatchProduct = async (file: File) => {
    try {
      const response = await agent.Product.updateBatchProduct(file);
      if(response.success) {
        toast.success(response.data);
        this.loadStrategyProducts(this.pageSize, this.pageNumber, this.supplierId ?? undefined, this.sizeId ?? undefined, this.uploadWebsiteStatuses, this.term ?? undefined);
      } else {
        toast.error(response.errors?.[0] || "Lỗi khi cập nhật sản phẩm");
      }
    } catch (error) {
      console.error("Error updating batch product:", error);
      toast.error("Lỗi khi cập nhật sản phẩm");
    }
  }

  bulkEditDto = {
    listPrice: null as number | null,
    supplierRisingPrice: null as number | null,
    otherPriceByCompany: null as number | null,
    shippingFee: null as number | null,
    discount: null as number | null,
    policyStandard: null as number | null,
    supplierDiscountCash: null as number | null,
    supplierDiscountPercentage: null as number | null,
    firstPolicyStandardAfterDiscount: null as number | null,
    secondPolicyStandardAfterDiscount: null as number | null,
    taxId: null as number | null,
    quantityPerBox: null as number | null,
    weightPerUnit: null as number | null,
  };

  setBulkEditField = (field: keyof typeof this.bulkEditDto, value: any) => {
    this.bulkEditDto[field] = value;
  };

  resetBulkEditDto = () => {
    Object.keys(this.bulkEditDto).forEach((key) => {
      this.bulkEditDto[key as keyof typeof this.bulkEditDto] = null;
    });
  };

  generateReport = async () => {
    runInAction(() => {
      this.reportGenerationLoading = true;
    });
    try {
      const response = await agent.Product.generateReport();
      if(response.success) {
        return true;
      } else {
        toast.error(response.errors?.[0] || "Lỗi khi tạo báo cáo");
        return false;
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Lỗi khi tạo báo cáo");
      return false;
    } finally {
      runInAction(() => {
        this.reportGenerationLoading = false;
      });
    }
  }

  updateColor = async (file: File) => {
    try {
      const response = await agent.Product.updateColor(file);
      if(response.success) {
        toast.success(response.data);
        this.loadProducts();
      } else {
        toast.error(response.errors?.[0] || "Lỗi khi cập nhật màu sắc");
      }
    } catch (error) {
      console.error("Error updating color:", error);
      toast.error("Lỗi khi cập nhật màu sắc");
    }
  }
}

