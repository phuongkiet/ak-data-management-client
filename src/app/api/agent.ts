import axios, { AxiosError, AxiosResponse } from "axios";
import { router } from "../router/route.tsx";
import { toast } from "react-toastify";
import { store } from "../stores/store.ts";
import {
  AddUserDto,
  User,
  UserDto,
  UserLoginFormValues,
  UserUpdateDto,
} from "../models/user/user.model.ts";
import { PagedModel } from "../models/common/pagedModel.model.ts";
import {
  EditProductDto,
  EditBulkStrategyProductDto,
  ProductDetail,
  ProductDto,
  ProductMetadataDto,
  StrategyProductDetailDto,
  StrategyProductDto,
  SupplierSizeCombinationDto,
  EditStrategyProductDto,
  CalculateProcessingPriceRequest,
  CalculateProcessingPriceResponse,
} from "../models/product/product.model.ts";
import {
  ProductSupplierDto,
  SupplierDetailDto,
  UpdateSupplierForStrategyDto,
} from "../models/product/productSupplier.model.ts";
import {
  AddMaterialDto,
  ProductMaterialDto,
  UpdateMaterialDto,
} from "../models/product/productMaterial.model.ts";
import {
  AddSurfaceDto,
  ProductSurfaceDto,
  UpdateSurfaceDto,
} from "../models/product/productSurface.model.ts";
import {
  AddStorageDto,
  ProductStorageDto,
  UpdateStorageDto,
} from "../models/product/productStorage.model.ts";
import {
  AddCompanyCodeDto,
  CompanyCodeDto,
  UpdateCompanyCodeDto,
} from "../models/product/companyCode.model.ts";
import {
  AddAntiSlipperyDto,
  ProductAntiSlipperyDto,
  UpdateAntiSlipperyDto,
} from "../models/product/productAntiSlippery.model.ts";
import {
  AddBodyColorDto,
  ProductBodyColorDto,
  UpdateBodyColorDto,
} from "../models/product/productBodyColor.model.ts";
import {
  AddColorDto,
  ProductColorDto,
  UpdateColorDto,
} from "../models/product/productColor.model.ts";
import {
  AddOriginDto,
  ProductOriginDto,
  UpdateOriginDto,
} from "../models/product/productOrigin.model.ts";
import {
  AddPatternDto,
  ProductPatternDto,
  UpdatePatternDto,
} from "../models/product/productPattern.model.ts";
import {
  AddProcessingDto,
  ProductProcessingDto,
  UpdateProcessingDto,
} from "../models/product/productProcessing.model.ts";
import {
  AddSizeDto,
  ProductSizeDto,
  UpdateSizeDto,
} from "../models/product/productSize.model.ts";
import {
  AddWaterAbsorptionDto,
  ProductWaterAbsorptionDto,
  UpdateWaterAbsorptionDto,
} from "../models/product/productWaterAbsorption.model.ts";
import {
  AddCalculatedUnitDto,
  CalculatedUnitDto,
  UpdateCalculatedUnitDto,
} from "../models/product/calculatedUnit.model.ts";
import {
  AddFactoryDto,
  ProductFactoryDto,
  UpdateFactoryDto,
} from "../models/product/productFactory.model.ts";
import { AddProductDto } from "../models/product/product.model.ts";
import { AddSupplierDto } from "../models/product/productSupplier.model.ts";
import {
  AddAreaDto,
  ProductAreaDto,
  UpdateAreaDto,
} from "../models/product/productArea.model.ts";
import {
  ForgotPasswordModel,
  ResendEmailConfirmModel,
  ResetPasswordModel,
  VerifyEmailModel,
} from "../models/auth/authentication.model.ts";
import {
  AddLinkStorageDto,
  LinkStorageDto,
  UpdateLinkStorageDto,
} from "../models/storage/linkStorage.model.ts";

export interface ApiResponseModel<T> {
  success: boolean;
  errors: string[];
  formErrors: Record<string, string>;
  data?: T;
}

const DEPLOYED_URL = import.meta.env.VITE_API_V1_URL;
const LOCAL_URL = import.meta.env.VITE_LOCAL_API_V1_URL;
// const NGROK_URL = import.meta.env.VITE_NGROK_URL;

if (DEPLOYED_URL) {
  // axios.defaults.baseURL = DEPLOYED_URL;
  axios.defaults.baseURL = DEPLOYED_URL;
} else {
  axios.defaults.baseURL = LOCAL_URL;
  // axios.defaults.baseURL = NGROK_URL;
}

axios.interceptors.response.use(
  async (response) => {
    // if (import.meta.env.DEV) await sleep(1000);
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;
    switch (status) {
      case 400: {
        console.log(data);
        if (
          config.method === "get" &&
          Object.prototype.hasOwnProperty.call(data.errors, "id")
        ) {
          router.navigate("/not-found");
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
        toast.error("Unauthorized");
        break;
      case 403:
        toast.error("Forbidden");
        break;
      case 404:
        router.navigate("/not-found");
        break;
      case 500:
        store.commonStore.setServerError(data);
        router.navigate("/server-error");
        break;
      case 503:
        toast.error("Service temporarily unavailable. Please try again later.");
        break;
    }
    return Promise.reject(error);
  }
);

const responseBody = <T>(
  response: AxiosResponse<ApiResponseModel<T>>
): ApiResponseModel<T> => response.data;

//Phần này dùng sẽ tạo interceptor để inject token vào request
axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  // config.headers["ngrok-skip-browser-warning"] = "true";
  return config;
});

const requests = {
  get: <T>(url: string): Promise<ApiResponseModel<T>> =>
    axios.get<ApiResponseModel<T>>(url).then(responseBody),
  post: <T>(url: string, body: object): Promise<ApiResponseModel<T>> =>
    axios.post<ApiResponseModel<T>>(url, body).then(responseBody),
  put: <T>(url: string, body: object): Promise<ApiResponseModel<T>> =>
    axios.put<ApiResponseModel<T>>(url, body).then(responseBody),
  patch: <T>(url: string, body?: object): Promise<ApiResponseModel<T>> =>
    axios.patch<ApiResponseModel<T>>(url, body).then(responseBody),
  del: <T>(url: string): Promise<ApiResponseModel<T>> =>
    axios.delete<ApiResponseModel<T>>(url).then(responseBody),
};

const Account = {
  current: (): Promise<ApiResponseModel<User>> => requests.get<User>("/auth"),
  login: (user: UserLoginFormValues): Promise<ApiResponseModel<User>> =>
    requests.post<User>("/auth/login", user),
  verifyEmail: (dto: VerifyEmailModel): Promise<ApiResponseModel<string>> =>
    requests.post<string>(`/auth/verify-otp`, dto),
  forgotPassword: (
    dto: ForgotPasswordModel
  ): Promise<ApiResponseModel<string>> =>
    requests.post<string>(`/auth/forgotPassword`, dto),
  resetPassword: (dto: ResetPasswordModel): Promise<ApiResponseModel<string>> =>
    requests.post<string>(`/auth/resetPassword`, dto),
  resendEmailConfirm: (
    dto: ResendEmailConfirmModel
  ): Promise<ApiResponseModel<string>> =>
    requests.post<string>(`/auth/resend-verification-otp`, dto),
  // changePassword: (values: any): Promise<ApiResponseModel<string>> =>
  //   requests.post<string>(`/auth/changeUserPassword`, values),
  updateAvatar: (request: {
    userEmail: string;
    file: File;
  }): Promise<ApiResponseModel<string>> => {
    const formData = new FormData();

    formData.append("UserEmail", request.userEmail);
    formData.append("File", request.file);

    return requests.put<string>("/users/update-avatar", formData);
  },
};

const UserAdmin = {
  adminList: (term?: string): Promise<ApiResponseModel<UserDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<UserDto[]>(`/users?${params.toString()}`);
  },
  addUser: (user: AddUserDto): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/users/add-user", user),
  banUser: (userEmail: string): Promise<ApiResponseModel<string>> =>
    requests.put<string>(`/users/ban-user?userEmail=${userEmail}`, {}),
  unBanUser: (userEmail: string): Promise<ApiResponseModel<string>> =>
    requests.put<string>(`/users/unban-user?userEmail=${userEmail}`, {}),
  updateUser: (
    userEmail: string,
    dto: UserUpdateDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(`/users/update-user?userEmail=${userEmail}`, dto),
};

const Product = {
  productList: (
    pageSize?: number,
    pageNumber?: number,
    term?: string,
    supplierId?: number,
    sizeId?: number
  ): Promise<ApiResponseModel<PagedModel<ProductDto>>> => {
    const params = new URLSearchParams();
    if (pageSize) params.append("PageSize", pageSize.toString());
    if (pageNumber) params.append("PageNumber", pageNumber.toString());
    if (supplierId) params.append("SupplierId", supplierId.toString());
    if (sizeId) params.append("SizeId", sizeId.toString());
    if (term) params.append("Term", term);

    return requests.get<PagedModel<ProductDto>>(
      `/products?${params.toString()}`
    );
  },

  getExistingSupplierSizeCombinations: (): Promise<
    ApiResponseModel<SupplierSizeCombinationDto[]>
  > =>
    requests.get<SupplierSizeCombinationDto[]>(
      "/products/existing-supplier-size-combinations"
    ),

  strategyProductList: (
    pageSize?: number,
    pageNumber?: number,
    term?: string
  ): Promise<ApiResponseModel<PagedModel<StrategyProductDto>>> => {
    const params = new URLSearchParams();
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (pageNumber) params.append("pageNumber", pageNumber.toString());
    if (term) params.append("term", term);

    return requests.get<PagedModel<StrategyProductDto>>(
      `/products/strategy-products?${params.toString()}`
    );
  },

  getProductById: (id: number): Promise<ApiResponseModel<ProductDetail>> =>
    requests.get<ProductDetail>("/products/product-detail?productId=" + id),

  getStrategyProductById: (
    id: number
  ): Promise<ApiResponseModel<StrategyProductDetailDto>> =>
    requests.get<StrategyProductDetailDto>(
      "/products/strategy-product-detail?productId=" + id
    ),

  getNextOrderNumber: (supplierId: number): Promise<ApiResponseModel<number>> =>
    requests.get<number>("/products/suppliers-order?supplierId=" + supplierId),

  getTotalProducts: (): Promise<ApiResponseModel<number>> =>
    requests.get<number>("/products/total-products"),

  addNewProduct: (product: AddProductDto): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/products/add-new", product),

  editProduct: (
    productId: number,
    product: EditProductDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(
      `/products/edit-product?productId=${productId}`,
      product
    ),

  checkSupplierItemCode: (
    itemCode: string
  ): Promise<ApiResponseModel<boolean>> =>
    requests.get<boolean>(
      "/products/check-supplier-item-code?supplierItemCode=" + itemCode
    ),

  importProducts: (file: File): Promise<ApiResponseModel<number>> => {
    const formData = new FormData();
    formData.append("file", file);
    return requests.post<number>("/products/import", formData);
  },

  getProductMetadata: (): Promise<ApiResponseModel<ProductMetadataDto>> =>
    requests.get<ProductMetadataDto>("/products/product-metadata"),

  editBulkStrategyProduct: (
    editBulkStrategyProductDto: EditBulkStrategyProductDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(
      "/products/bulk-strategy-edit-product",
      editBulkStrategyProductDto
    ),

  editStrategyProduct: (
    id: number,
    editStrategyProductDto: EditStrategyProductDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(
      `/products/strategy-edit-product?productId=${id}`,
      editStrategyProductDto
    ),

  calculateProcessingPrice: (
    calculateProcessingPriceRequest: CalculateProcessingPriceRequest
  ): Promise<ApiResponseModel<CalculateProcessingPriceResponse>> =>
    requests.post<CalculateProcessingPriceResponse>(
      "products/calculate-processing-product",
      calculateProcessingPriceRequest
    ),

  updateBatchProduct: (file: File): Promise<ApiResponseModel<string>> => {
    const formData = new FormData();
    formData.append("file", file);
    return requests.put<string>("/products/update-batch-product", formData);
  },
};

const ProductSupplier = {
  supplierList: (
    term?: string
  ): Promise<ApiResponseModel<ProductSupplierDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<ProductSupplierDto[]>(
      `/suppliers?${params.toString()}`
    );
  },
  addSupplier: (supplier: AddSupplierDto): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/suppliers/add-supplier", supplier),
  getNextSupplierOrderNumber: (
    term: string
  ): Promise<ApiResponseModel<number>> =>
    requests.get<number>(`/suppliers/get-order?term=${term}`),
  updateSupplier: (
    id: number,
    supplier: UpdateSupplierForStrategyDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(
      `/suppliers/strategist-update-supplier?supplierId=${id}`,
      supplier
    ),
  loadDetail: (id: number): Promise<ApiResponseModel<SupplierDetailDto>> =>
    requests.get<SupplierDetailDto>(
      `/suppliers/supplier-detail?supplierId=` + id
    ),
};

const ProductMaterial = {
  materialList: (
    term?: string
  ): Promise<ApiResponseModel<ProductMaterialDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<ProductMaterialDto[]>(
      `/materials?${params.toString()}`
    );
  },
  addMaterial: (material: AddMaterialDto): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/materials/add-material", material),
  updateMaterial: (
    materialId: number,
    material: UpdateMaterialDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(
      `/materials/update-material?materialId=${materialId}`,
      material
    ),
};

const ProductSurface = {
  surfaceList: (
    term?: string
  ): Promise<ApiResponseModel<ProductSurfaceDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<ProductSurfaceDto[]>(`/surfaces?${params.toString()}`);
  },
  addSurface: (surface: AddSurfaceDto): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/surfaces/add-surface", surface),
  updateSurface: (
    surfaceId: number,
    surface: UpdateSurfaceDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(
      `/surfaces/update-surface?surfaceId=${surfaceId}`,
      surface
    ),
};

const ProductStorage = {
  storageList: (
    term?: string
  ): Promise<ApiResponseModel<ProductStorageDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<ProductStorageDto[]>(`/storages?${params.toString()}`);
  },
  addStorage: (storage: AddStorageDto): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/storages/add-storage", storage),
  updateStorage: (
    storageId: number,
    storage: UpdateStorageDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(
      `/storages/update-storage?storageId=${storageId}`,
      storage
    ),
};

const CompanyCode = {
  companyCodeList: (
    term?: string
  ): Promise<ApiResponseModel<CompanyCodeDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<CompanyCodeDto[]>(
      `/company-codes?${params.toString()}`
    );
  },
  addCompanyCode: (
    companyCode: AddCompanyCodeDto
  ): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/company-codes/add-company-code", companyCode),
  updateCompanyCode: (
    companyCodeId: number,
    companyCode: UpdateCompanyCodeDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(
      `/company-codes/update-company-code?companyCodeId=${companyCodeId}`,
      companyCode
    ),
};

const CalculatedUnit = {
  calculatedUnitList: (
    term?: string
  ): Promise<ApiResponseModel<CalculatedUnitDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<CalculatedUnitDto[]>(
      `/calculated-units?${params.toString()}`
    );
  },
  addCalculatedUnit: (
    calculatedUnit: AddCalculatedUnitDto
  ): Promise<ApiResponseModel<string>> =>
    requests.post<string>(
      "/calculated-units/add-calculated-unit",
      calculatedUnit
    ),
  updateCalculatedUnit: (
    calculatedUnitId: number,
    calculatedUnit: UpdateCalculatedUnitDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(
      `/calculated-units/update-calculated-unit?calculatedUnitId=${calculatedUnitId}`,
      calculatedUnit
    ),
};

const AntiSlippery = {
  antiSlipperyList: (
    term?: string
  ): Promise<ApiResponseModel<ProductAntiSlipperyDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<ProductAntiSlipperyDto[]>(
      `/anti-slipperys?${params.toString()}`
    );
  },
  addAntiSlippery: (
    antiSlippery: AddAntiSlipperyDto
  ): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/anti-slipperys/add-anti-slippery", antiSlippery),
  updateAntiSlippery: (
    antiSlipperyId: number,
    antiSlippery: UpdateAntiSlipperyDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(
      `/anti-slipperys/update-anti-slippery?antiSlipperyId=${antiSlipperyId}`,
      antiSlippery
    ),
};

const ProductBodyColor = {
  bodyColorList: (
    term?: string
  ): Promise<ApiResponseModel<ProductBodyColorDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<ProductBodyColorDto[]>(
      `/body-colors?${params.toString()}`
    );
  },
  addBodyColor: (
    bodyColor: AddBodyColorDto
  ): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/body-colors/add-body-color", bodyColor),
  updateBodyColor: (
    bodyColorId: number,
    bodyColor: UpdateBodyColorDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(
      `/body-colors/update-body-color?bodyColorId=${bodyColorId}`,
      bodyColor
    ),
};

const ProductColor = {
  colorList: (term?: string): Promise<ApiResponseModel<ProductColorDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<ProductColorDto[]>(`/colors?${params.toString()}`);
  },
  addColor: (color: AddColorDto): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/colors/add-color", color),
  updateColor: (
    colorId: number,
    color: UpdateColorDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(`/colors/update-color?colorId=${colorId}`, color),
};

const ProductOrigin = {
  originList: (
    term?: string
  ): Promise<ApiResponseModel<ProductOriginDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<ProductOriginDto[]>(`/origins?${params.toString()}`);
  },
  addOrigin: (origin: AddOriginDto): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/origins/add-origin", origin),
  updateOrigin: (
    originId: number,
    origin: UpdateOriginDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(`/origins/update-origin?originId=${originId}`, origin),
};

const ProductPattern = {
  patternList: (
    term?: string
  ): Promise<ApiResponseModel<ProductPatternDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<ProductPatternDto[]>(`/patterns?${params.toString()}`);
  },
  addPattern: (pattern: AddPatternDto): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/patterns/add-pattern", pattern),
  updatePattern: (
    patternId: number,
    pattern: UpdatePatternDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(
      `/patterns/update-pattern?patternId=${patternId}`,
      pattern
    ),
};

const ProductProcessing = {
  processingList: (
    term?: string
  ): Promise<ApiResponseModel<ProductProcessingDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<ProductProcessingDto[]>(
      `/processings?${params.toString()}`
    );
  },
  addProcessing: (
    processing: AddProcessingDto
  ): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/processings/add-processing", processing),
  updateProcessing: (
    processingId: number,
    processing: UpdateProcessingDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(
      `/processings/update-processing?processingId=${processingId}`,
      processing
    ),
};

const ProductSize = {
  sizeList: (term?: string): Promise<ApiResponseModel<ProductSizeDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<ProductSizeDto[]>(`/sizes?${params.toString()}`);
  },

  addSize: (size: AddSizeDto): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/sizes/add-size", size),
  updateSize: (
    sizeId: number,
    size: UpdateSizeDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(`/sizes/update-size?sizeId=${sizeId}`, size),
};

const ProductWaterAbsorption = {
  waterAbsorptionList: (
    term?: string
  ): Promise<ApiResponseModel<ProductWaterAbsorptionDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<ProductWaterAbsorptionDto[]>(
      `/water-absorptions?${params.toString()}`
    );
  },
  addWaterAbsorption: (
    waterAbsorption: AddWaterAbsorptionDto
  ): Promise<ApiResponseModel<string>> =>
    requests.post<string>(
      "/water-absorptions/add-water-absorption",
      waterAbsorption
    ),
  updateWaterAbsorption: (
    waterAbsorptionId: number,
    waterAbsorption: UpdateWaterAbsorptionDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(
      `/water-absorptions/update-water-absorption?waterAbsorptionId=${waterAbsorptionId}`,
      waterAbsorption
    ),
};

const ProductFactory = {
  factoryList: (
    term?: string
  ): Promise<ApiResponseModel<ProductFactoryDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<ProductFactoryDto[]>(`/factories?${params.toString()}`);
  },
  getFactoriesBySupplier: (
    supplierId: number
  ): Promise<ApiResponseModel<ProductFactoryDto[]>> =>
    requests.get<ProductFactoryDto[]>(
      `/factories/supplier?supplierId=${supplierId}`
    ),
  addFactory: (factory: AddFactoryDto): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/factories/add-factory", factory),
  updateFactory: (
    factoryId: number,
    factory: UpdateFactoryDto
  ): Promise<ApiResponseModel<string>> =>
    requests.put<string>(
      `/factories/update-factory?factoryId=${factoryId}`,
      factory
    ),
};

const ProductArea = {
  areaList: (term?: string): Promise<ApiResponseModel<ProductAreaDto[]>> => {
    const params = new URLSearchParams();
    if (term) params.append("term", term);

    return requests.get<ProductAreaDto[]>(`/areas?${params.toString()}`);
  },
  addArea: (area: AddAreaDto): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/areas/add-area", area),
  updateArea: (area: UpdateAreaDto): Promise<ApiResponseModel<string>> =>
    requests.put<string>("/areas/update-area", area),
};

const LinkStorage = {
  linkStorageList: (): Promise<ApiResponseModel<LinkStorageDto[]>> =>
    requests.get<LinkStorageDto[]>("/links"),
  addLinkStorage: (linkStorage: AddLinkStorageDto): Promise<ApiResponseModel<string>> =>
    requests.post<string>("/links/add-link", linkStorage),
  updateLinkStorage: (linkId: number, linkStorage: UpdateLinkStorageDto): Promise<ApiResponseModel<string>> =>
    requests.put<string>(
      `/links/update-link?linkId=${linkId}`,
      linkStorage
    ),
};

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
  ProductArea,
  LinkStorage,
};

export default agent;
