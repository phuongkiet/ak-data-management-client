import { UploadWebsiteStatus } from "../product/enum/product.enum";

export interface AdvancedSearchDto {
  pageSize: number;
  pageNumber: number;
  term: string | null;
  supplierId: number | null;
  sizeId: number | null;
  uploadWebsiteStatuses: UploadWebsiteStatus[];
  isPriced: boolean | null;
}