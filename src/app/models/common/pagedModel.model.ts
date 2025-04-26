export interface PagedModel<T> {
  results: T[];
  pageNo: number;
  totalItems: number;
  totalPage: number;
}