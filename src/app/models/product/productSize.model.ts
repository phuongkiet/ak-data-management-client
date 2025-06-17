export interface ProductSizeDto {
  id: number;
  wide: number;
  length: number;
  autoSized: string;
  companyCodeId: number | null;
}

export interface AddSizeDto {
  wide: number;
  length: number;
  autoSized: string;
  companyCodeId: number | null;
}

export interface UpdateSizeDto {
  wide: number;
  length: number;
  autoSized: string;
  companyCodeId: number | null;
}


