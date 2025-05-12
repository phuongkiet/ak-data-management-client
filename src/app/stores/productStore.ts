import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent'
import { AddProductDto, ProductDetail, ProductDto, StrategyProductDto } from '../models/product/product.model'
import { toast } from 'react-toastify'
import { UploadWebsiteStatus } from '../models/product/enum/product.enum.ts'

export default class ProductStore {

  //Product
  productRegistry = new Map<number, ProductDto>()
  strategyProductRegistry = new Map<number, StrategyProductDto>()
  productList: ProductDto[] = []
  strategyProductList: StrategyProductDto[] = []
  loading = false
  pageNumber = 1
  pageSize = 10
  totalPages = 0
  totalCount = 0
  term: string = ''

  productForm: AddProductDto = {} as AddProductDto
  productDetail: ProductDetail = {} as ProductDetail

  resetProductForm = () => {
    runInAction(() => {
      this.productForm = {
        originCountryId: 0,
        actualSizeId: 0,
        brickPatternId: 0,
        colorId: 0,
        surfaceFeatureId: 0,
        materialId: 0,
        brickBodyId: 0,
        storageId: 0,
        antiSlipId: 0,
        supplierId: 0,
        companyCodeId: 0,
        processingId: null,
        waterAbsorptionId: 0,
        taxId: null,
        calculatedUnitId: 0,
        productFactoryId: 0,

        priceDetermination: 0,
        noticeDataWebsite: 0,
        uploadWebsiteStatus: UploadWebsiteStatus.NotCaptured,
        discountConditions: 0,
        secondDiscountConditions: 0,

        supplierItemCode: '',
        supplerCode: '',
        productOrderNumber: undefined,
        productCode: '',
        autoBarCode: '',
        displayWebsiteName: '',
        webProductPrice: null,
        webDiscountedPrice: null,
        secondWebDiscountedPrice: null,
        autoCalculatedUnit: '',
        calculatedUnit: '',
        productSpecialNote: '',
        diameterSize: undefined,
        thicknessSize: 0,
        weightPerUnit: 0,
        weightPerBox: 0,
        quantityPerBox: 0,
        porcelainWarrantyPeriod: undefined,
        accessoryWarrantyPeriod: undefined,
        patternQuantity: 0,
        isInside: false,
        isOutside: false,
        isFlooring: false,
        isWalling: false,
        isCOCQ: false,
        isScratchResist: false,
        isAntiFouling: false,
        isEdgeGrinding: false,
        hardnessMOHS: 0,
        otherNote: '',
        deliveryEstimatedDate: '',
      }
    })
  }

  constructor() {
    makeAutoObservable(this)
    this.resetProductForm();
  }

  setPageNumber = (page: number) => {
    this.pageNumber = page;
    this.loadProducts(this.pageSize, this.pageNumber, this.term);
  }

  setTerm = (term: string) => {
    this.term = term;
    this.pageNumber = 1;
    this.loadProducts(this.pageSize, this.pageNumber, this.term);
  }

  loadProducts = async (pageSize: number, pageNumber: number, term?: string) => {
    this.loading = true
    try {
      const result = await agent.Product.productList(pageSize, pageNumber, term)
      console.log(result)
      runInAction(() => {
        this.productList = result.data?.results || []
        this.totalPages = result.data?.totalPage || 0
        this.totalCount = result.data?.totalItems || 0
        this.loading = false

        // Optionally: store products in a Map
        this.productRegistry.clear()
        this.productList.forEach(product => {
          if (product.id != null) this.productRegistry.set(product.id, product)
        })
      })
    } catch (error) {
      runInAction(() => {
        this.loading = false
      })
      console.error('Failed to load products', error)
      toast.error('Lỗi khi tải dữ liệu sản phẩm.')
    }
  }

  //Strategy Products
  loadStrategyProducts = async (pageSize: number, pageNumber: number, term?: string) => {
    this.loading = true
    try {
      const result = await agent.Product.strategyProductList(pageSize, pageNumber, term)
      console.log(result)
      runInAction(() => {
        this.strategyProductList = result.data?.results || []
        this.totalPages = result.data?.totalPage || 0
        this.totalCount = result.data?.totalItems || 0
        this.loading = false

        // Optionally: store products in a Map
        this.strategyProductRegistry.clear()
        this.strategyProductList.forEach(product => {
          if (product.id != null) this.strategyProductRegistry.set(product.id, product)
        })
      })
    } catch (error) {
      runInAction(() => {
        this.loading = false
      })
      console.error('Failed to load products', error)
    }
  }

  loadProductDetail = async (id: number) => {
    this.loading = true
    try {
      const response = await agent.Product.getProductById(id)
      const product = response.data // Truy xuất `data` từ response

      if (!product) throw new Error('Không có dữ liệu sản phẩm')

      runInAction(() => {
        this.productDetail = {
          ...{
            ...product
          }
        }
        console.log(this.productDetail)
        this.loading = false
      })
    } catch (error) {
      runInAction(() => {
        this.loading = false
      })
      console.error('Lỗi khi tải sản phẩm', error)
      toast.error('Không thể tải dữ liệu sản phẩm')
    }
  }

  updateProductForm = <K extends keyof AddProductDto>(field: K, value: AddProductDto[K]) => {
    runInAction(() => {
      this.productForm[field] = value
      console.log(this.productForm)
    })
  }

  //Supplier
  getNextOrderNumberAuto = async () => {
    try {
      if (this.productForm.processingId) {
        this.productForm.productOrderNumber = 0; // hoặc null
        return;
      }

      if (this.productForm.supplierId) {
        const response = await agent.Product.getNextOrderNumber(this.productForm.supplierId);
        runInAction(() => {
          if (response.data) {
            this.productForm.productOrderNumber = response.data;
          } else {
            toast.error(response.errors || 'Không lấy được số thứ tự.');
          }
        })
      }
    } catch (error) {
      console.error('Error getting next order number:', error);
      this.productForm.productOrderNumber = 0; // fallback
    }
  }

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
          toast.error(response.errors?.[0] || 'Có lỗi xảy ra khi tạo sản phẩm');
        });
        return null;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error('Error creating product:', error);
      toast.error('Có lỗi xảy ra khi tạo sản phẩm');
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
          this.totalCount = response.data || 0;
        } else {
          toast.error(response.errors?.[0] || 'Không lấy được tổng số sản phẩm');
        }
      });
    } catch (error) {
      console.error('Error getting total products:', error);
    }
  }

  checkSupplierItemCode = async (supplierItemCode: string) => {
    try {
      const response = await agent.Product.checkSupplierItemCode(supplierItemCode);
      return response.data;
    } catch (error) {
      console.error('Error checking SKU:', error);
    }
  }

  importProducts = async (file: File) => {
    this.loading = true;
    try {
      const response = await agent.Product.importProducts(file);
      if (response.success) {
        runInAction(() => {
          toast.success(`Đã nhập ${response.data} sản phẩm thành công.`);
          this.loadProducts(this.pageSize, this.pageNumber, this.term); // Reload the product list after import
        });
      } else {
        runInAction(() => {
          toast.error(response.errors?.[0] || 'Lỗi khi nhập sản phẩm');
        });
      }
    } catch (error) {
      console.error('Error importing products:', error);
      toast.error('Lỗi khi nhập sản phẩm');
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}
