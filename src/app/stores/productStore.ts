import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { AddProductDto, ProductDto, StrategyProductDto } from '../models/product/product.model'
import { toast } from 'react-toastify'

export default class ProductStore {
  productRegistry = new Map<number, ProductDto>();
  strategyProductRegistry = new Map<number, StrategyProductDto>();
  productList: ProductDto[] = [];
  strategyProductList: StrategyProductDto[] = [];
  loading = false;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalCount = 0;
  term: string = '';

  productForm: AddProductDto = {} as AddProductDto;

  constructor() {
    makeAutoObservable(this);
  }

  setPageNumber = (page: number) => {
    this.pageNumber = page;
    this.loadProducts();
  };

  setTerm = (term: string) => {
    this.term = term;
    this.pageNumber = 1;
    this.loadProducts();
  };

  loadProducts = async () => {
    this.loading = true;
    try {
      const result = await agent.Product.productList(10, 1, this.term);
      console.log(result);
      runInAction(() => {
        this.productList = result.data?.results || [];
        this.totalPages = result.data?.totalPage || 0;
        this.totalCount = result.data?.totalItems || 0;
        this.loading = false;

        // Optionally: store products in a Map
        this.productRegistry.clear();
        this.productList.forEach(product => {
          if (product.id != null) this.productRegistry.set(product.id, product);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load products", error);
      toast.error("Lỗi khi tải dữ liệu sản phẩm.")
    }
  };

  //Strategy Products
  loadStrategyProducts = async () => {
    this.loading = true;
    try {
      const result = await agent.Product.strategyProductList(10, 1, this.term);
      console.log(result);
      runInAction(() => {
        this.strategyProductList = result.data?.results || [];
        this.totalPages = result.data?.totalPage || 0;
        this.totalCount = result.data?.totalItems || 0;
        this.loading = false;

        // Optionally: store products in a Map
        this.strategyProductRegistry.clear();
        this.strategyProductList.forEach(product => {
          if (product.id != null) this.strategyProductRegistry.set(product.id, product);
        });
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load products", error);
    }
  };

  getProductById = (id: number): ProductDto | undefined => {
    return this.productRegistry.get(id);
  };

  updateProductForm = <K extends keyof AddProductDto>(field: K, value: AddProductDto[K]) => {
    this.productForm[field] = value;
    console.log(this.productForm)
  }
}
