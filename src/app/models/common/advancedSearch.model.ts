export interface AdvancedSearchDto {
  pageSize: number;
  pageNumber: number;
  term: string | null;
  supplierId: number | null;
  sizeId: number | null;
}