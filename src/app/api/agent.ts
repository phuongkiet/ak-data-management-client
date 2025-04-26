import axios, {AxiosError, AxiosResponse} from "axios";
import {router} from "../router/route.tsx";
import {toast} from "react-toastify";
import {store} from "../stores/store.ts";
import {User, UserAdminDTO, UserLoginFormValues} from "../models/user/user.model.ts";
import {PagedModel} from "../models/common/pagedModel.model.ts";
import { ProductDto, StrategyProductDto } from '../models/product/product.model.ts'

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
  }
}

const agent = {
  Account,
  UserAdmin,
  Product,

}

export default agent;