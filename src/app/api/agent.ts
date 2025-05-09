import axios, {AxiosError, AxiosResponse} from "axios";
import {router} from "../router/route.tsx";
import {toast} from "react-toastify";
import {store} from "../stores/store.ts";
import {User, UserAdminDTO, UserLoginFormValues} from "../models/user/user.model.ts";
import {PagedModel} from "../models/common/pagedModel.model.ts";
import { ProductDetail, ProductDto, StrategyProductDto } from '../models/product/product.model.ts'
import { ProductSupplierDto } from '../models/product/productSupplier.model.ts'
import { ProductMaterialDto } from '../models/product/productMaterial.model.ts'
import { ProductSurfaceDto } from '../models/product/productSurface.model.ts'
import { ProductStorageDto } from '../models/product/productStorage.model.ts'
import { CompanyCodeDto } from '../models/product/companyCode.model.ts'
import { ProductAntiSlipperyDto } from '../models/product/productAntiSlippery.model.ts'
import { ProductBodyColorDto } from '../models/product/productBodyColor.model.ts'
import { ProductColorDto } from '../models/product/productColor.model.ts'
import { ProductOriginDto } from '../models/product/productOrigin.model.ts'
import { AddPatternDto, ProductPatternDto } from '../models/product/productPattern.model.ts'
import { ProductProcessingDto } from '../models/product/productProcessing.model.ts'
import { ProductSizeDto } from '../models/product/productSize.model.ts'
import { ProductWaterAbsorptionDto } from '../models/product/productWaterAbsorption.model.ts'
import { CalculatedUnitDto } from '../models/product/calculatedUnit.model.ts'
import { AddFactoryDto, ProductFactoryDto } from "../models/product/productFactory.model.ts";
import { AddProductDto } from '../models/product/product.model.ts'
import { AddSupplierDto } from '../models/product/productSupplier.model.ts'
import { ProductAreaDto } from "../models/product/productArea.model.ts";

export interface ApiResponseModel<T> {
  success: boolean;
  errors: string[];
  formErrors: Record<string, string>;
  data?: T;
}

axios.defaults.baseURL = "https://localhost:7263/api/";

axios.interceptors.response.use(async response => {
  // if (import.meta.env.DEV) await sleep(1000);
  return response;
}, (error: AxiosError) => {
  const {data, status, config} = error.response as AxiosResponse;
  switch (status) {
    case 400: {
      console.log(data);
      if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
        router.navigate('/not-found');
      }
      if (data.errors) {
        if (data.errors.length === 1) {
          toast.error(data.errors[0]);
        } else {
          const modelStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
            }
          }
          throw modelStateErrors.flat();
        }
      } else {
        if (Array.isArray(data)) {
          toast.error(data[0]);
        } else {
          toast.error(data);
        }
      }
      break;
    }
    case 401:
      toast.error('Unauthorized');
      break;
    case 403:
      toast.error('Forbidden');
      break;
    case 404:
      router.navigate('/not-found');
      break;
    case 500:
      store.commonStore.setServerError(data);
      router.navigate('/server-error')
      break;
  }
  return Promise.reject(error);
});

const responseBody = <T>(response: AxiosResponse<ApiResponseModel<T>>): ApiResponseModel<T> => response.data;

//Phần này dùng sẽ tạo interceptor để inject token vào request
axios.interceptors.request.use(config => {
  const token = store.commonStore.token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const requests = {
  get: <T>(url: string): Promise<ApiResponseModel<T>> => axios.get<ApiResponseModel<T>>(url).then(responseBody),
  post: <T>(url: string, body: object): Promise<ApiResponseModel<T>> => axios.post<ApiResponseModel<T>>(url, body).then(responseBody),
  put: <T>(url: string, body: object): Promise<ApiResponseModel<T>> => axios.put<ApiResponseModel<T>>(url, body).then(responseBody),
  patch: <T>(url: string, body?: object): Promise<ApiResponseModel<T>> => axios.patch<ApiResponseModel<T>>(url, body).then(responseBody),
  del: <T>(url: string): Promise<ApiResponseModel<T>> => axios.delete<ApiResponseModel<T>>(url).then(responseBody),
};

const Account = {
  current: (): Promise<ApiResponseModel<User>> => requests.get<User>('/auth'),
  login: (user: UserLoginFormValues): Promise<ApiResponseModel<User>> => requests.post<User>('/auth/login', user),
  // register: (user: UserRegisterFormValues): Promise<ApiResponseModel<User>> => requests.post<User>('/auth/register', user),
  // verifyEmail: (email: string, token: string): Promise<ApiResponseModel<void>> => requests.post<void>(`/auth/verifyEmail?token=${token}&email=${email}`, {}),
  // forgotPassword: (email: string): Promise<ApiResponseModel<void>> => requests.get<void>(`/auth/forgotPassword-web?email=${email}`),
  // changePassword: (values: any): Promise<ApiResponseModel<void>> => requests.post<void>(`/auth/changeUserPassword`, values),
  // resetPassword: (values: any): Promise<ApiResponseModel<any>> => requests.post(`/auth/resetPassword-web`, values),
  // resendEmailConfirm: (email: string) => requests.get(`/auth/resendEmailConfirmationLink?email=${email}`),
};

const UserAdmin = {
  adminList: (pageSize?: number, pageNumber?: number, term?: string): Promise<ApiResponseModel<PagedModel<UserAdminDTO>>> => {
    const params = new URLSearchParams();
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (pageNumber) params.append("pageNumber", pageNumber.toString());
    if (term) params.append("term", term);

    return requests.get<PagedModel<UserAdminDTO>>(`/user?${params.toString()}`);
  }
};

const Product = {
  productList: (pageSize?: number, pageNumber?: number, term?: string): Promise<ApiResponseModel<PagedModel<ProductDto>>> => {
    const params = new URLSearchParams();
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (pageNumber) params.append("pageNumber", pageNumber.toString());
    if (term) params.append("term", term);

    return requests.get<PagedModel<ProductDto>>(`/products?${params.toString()}`);
  },

  strategyProductList: (pageSize?: number, pageNumber?: number, term?: string): Promise<ApiResponseModel<PagedModel<StrategyProductDto>>> => {
    const params = new URLSearchParams();
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (pageNumber) params.append("pageNumber", pageNumber.toString());
    if (term) params.append("term", term);

    return requests.get<PagedModel<StrategyProductDto>>(`/products/strategy-products?${params.toString()}`);
  },

  getProductById: (id: number): Promise<ApiResponseModel<ProductDetail>> => requests.get<ProductDetail>('/products/product-detail?productId=' + id),

  getNextOrderNumber: (supplierId: number): Promise<ApiResponseModel<number>> => requests.get<number>('/products/suppliers-order?supplierId=' + supplierId),

  addNewProduct: (product: AddProductDto): Promise<ApiResponseModel<string>> => 
    requests.post<string>('/products/add-new', product),
}

const ProductSupplier = {
  supplierList: (): Promise<ApiResponseModel<ProductSupplierDto[]>> => requests.get<ProductSupplierDto[]>('/suppliers'),
  addSupplier: (supplier: AddSupplierDto): Promise<ApiResponseModel<string>> => 
    requests.post<string>('/suppliers/add-supplier', supplier),
  getNextSupplierOrderNumber: (term: string): Promise<ApiResponseModel<number>> => 
    requests.get<number>(`/suppliers/get-order?term=${term}`),
  //getMovieDetail: (id: number): Promise<ApiResponseModel<MovieDetailDTO>> => requests.get<MovieDetailDTO>(`/movie/movie-detail?id=${id}`),
}

const ProductMaterial = {
  materialList: (): Promise<ApiResponseModel<ProductMaterialDto[]>> => requests.get<ProductMaterialDto[]>('/materials'),
  //getMovieDetail: (id: number): Promise<ApiResponseModel<MovieDetailDTO>> => requests.get<MovieDetailDTO>(`/movie/movie-detail?id=${id}`),
}

const ProductSurface = {
  surfaceList: (): Promise<ApiResponseModel<ProductSurfaceDto[]>> => requests.get<ProductSurfaceDto[]>('/surfaces'),
  //getMovieDetail: (id: number): Promise<ApiResponseModel<MovieDetailDTO>> => requests.get<MovieDetailDTO>(`/movie/movie-detail?id=${id}`),
}

const ProductStorage = {
  storageList: (): Promise<ApiResponseModel<ProductStorageDto[]>> => requests.get<ProductStorageDto[]>('/storages'),
  //getMovieDetail: (id: number): Promise<ApiResponseModel<MovieDetailDTO>> => requests.get<MovieDetailDTO>(`/movie/movie-detail?id=${id}`),
}

const CompanyCode = {
  companyCodeList: (): Promise<ApiResponseModel<CompanyCodeDto[]>> => requests.get<CompanyCodeDto[]>('/company-codes'),
  //getMovieDetail: (id: number): Promise<ApiResponseModel<MovieDetailDTO>> => requests.get<MovieDetailDTO>(`/movie/movie-detail?id=${id}`),
}

const CalculatedUnit = {
  calculatedUnitList: (): Promise<ApiResponseModel<CalculatedUnitDto[]>> => requests.get<CalculatedUnitDto[]>('/calculated-units'),
  //getMovieDetail: (id: number): Promise<ApiResponseModel<MovieDetailDTO>> => requests.get<MovieDetailDTO>(`/movie/movie-detail?id=${id}`),
}

const AntiSlippery = {
  antiSlipperyList: (): Promise<ApiResponseModel<ProductAntiSlipperyDto[]>> => requests.get<ProductAntiSlipperyDto[]>('/anti-slipperys'),
  //getMovieDetail: (id: number): Promise<ApiResponseModel<MovieDetailDTO>> => requests.get<MovieDetailDTO>(`/movie/movie-detail?id=${id}`),
}

const ProductBodyColor = {
  bodyColorList: (): Promise<ApiResponseModel<ProductBodyColorDto[]>> => requests.get<ProductBodyColorDto[]>('/body-colors'),
  //getMovieDetail: (id: number): Promise<ApiResponseModel<MovieDetailDTO>> => requests.get<MovieDetailDTO>(`/movie/movie-detail?id=${id}`),
}

const ProductColor = {
  colorList: (): Promise<ApiResponseModel<ProductColorDto[]>> => requests.get<ProductColorDto[]>('/colors'),
  //getMovieDetail: (id: number): Promise<ApiResponseModel<MovieDetailDTO>> => requests.get<MovieDetailDTO>(`/movie/movie-detail?id=${id}`),
}

const ProductOrigin = {
  originList: (): Promise<ApiResponseModel<ProductOriginDto[]>> => requests.get<ProductOriginDto[]>('/origins'),
  //getMovieDetail: (id: number): Promise<ApiResponseModel<MovieDetailDTO>> => requests.get<MovieDetailDTO>(`/movie/movie-detail?id=${id}`),
}

const ProductPattern = {
  patternList: (): Promise<ApiResponseModel<ProductPatternDto[]>> => requests.get<ProductPatternDto[]>('/patterns'),
  addPattern: (pattern: AddPatternDto): Promise<ApiResponseModel<string>> => 
    requests.post<string>('/patterns/add-pattern', pattern),
  //getMovieDetail: (id: number): Promise<ApiResponseModel<MovieDetailDTO>> => requests.get<MovieDetailDTO>(`/movie/movie-detail?id=${id}`),
}

const ProductProcessing = {
  processingList: (): Promise<ApiResponseModel<ProductProcessingDto[]>> => requests.get<ProductProcessingDto[]>('/processings'),
  //getMovieDetail: (id: number): Promise<ApiResponseModel<MovieDetailDTO>> => requests.get<MovieDetailDTO>(`/movie/movie-detail?id=${id}`),
}

const ProductSize = {
  sizeList: (): Promise<ApiResponseModel<ProductSizeDto[]>> => requests.get<ProductSizeDto[]>('/sizes'),
  //getMovieDetail: (id: number): Promise<ApiResponseModel<MovieDetailDTO>> => requests.get<MovieDetailDTO>(`/movie/movie-detail?id=${id}`),
}

const ProductWaterAbsorption = {
  waterAbsorptionList: (): Promise<ApiResponseModel<ProductWaterAbsorptionDto[]>> => requests.get<ProductWaterAbsorptionDto[]>('/water-absorption'),
  //getMovieDetail: (id: number): Promise<ApiResponseModel<MovieDetailDTO>> => requests.get<MovieDetailDTO>(`/movie/movie-detail?id=${id}`),
}

const ProductFactory = {
  factoryList: (): Promise<ApiResponseModel<ProductFactoryDto[]>> => requests.get<ProductFactoryDto[]>('/factories'),
  getFactoriesBySupplier: (supplierId: number): Promise<ApiResponseModel<ProductFactoryDto[]>> => 
    requests.get<ProductFactoryDto[]>(`/factories/supplier?supplierId=${supplierId}`),
  addFactory: (factory: AddFactoryDto): Promise<ApiResponseModel<string>> => 
    requests.post<string>('/factories/add-factory', factory),
  //getMovieDetail: (id: number): Promise<ApiResponseModel<MovieDetailDTO>> => requests.get<MovieDetailDTO>(`/movie/movie-detail?id=${id}`),
}

const ProductArea = {
  areaList: (): Promise<ApiResponseModel<ProductAreaDto[]>> => requests.get<ProductAreaDto[]>('/areas'),

}

const agent = {
  Account,
  UserAdmin,
  Product,
  ProductSupplier,
  ProductMaterial,
  ProductSurface,
  ProductStorage,
  CompanyCode,
  AntiSlippery,
  ProductBodyColor,
  ProductColor,
  ProductOrigin,
  ProductPattern,
  ProductProcessing,
  ProductSize,
  ProductWaterAbsorption,
  CalculatedUnit,
  ProductFactory,
  ProductArea
}

export default agent;