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
} from "../models/product/product.model";
import { toast } from "react-toastify";
import { UploadWebsiteStatus } from "../models/product/enum/product.enum.ts";
import { AdvancedSearchDto } from "../models/common/advancedSearch.model";

export default class ProductStore {
  //Product
  productRegistry = new Map<number, ProductDto>();
  strategyProductRegistry = new Map<number, StrategyProductDto>();
  productList: ProductDto[] = [];
  strategyProductList: StrategyProductDto[] = [];
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

  existingSupplierSizeCombinations: SupplierSizeCombinationDto[] = [];
  loadingCombinations = false;

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

        priceDetermination: 0,
        noticeDataWebsite: 0,
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

    const savedPageNumber = localStorage.getItem("pageNumber");
    const savedPageSize = localStorage.getItem("pageSize");

    this.pageNumber = savedPageNumber ? parseInt(savedPageNumber) : 1;
    this.pageSize = savedPageSize ? parseInt(savedPageSize) : 10;

    this.getTotalProducts();
    this.loadExistingSupplierSizeCombinations();
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
      console.log(response);
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
      if (this.productForm.supplierId) {
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
      }
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
}
