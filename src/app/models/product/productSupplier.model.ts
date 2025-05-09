export interface ProductSupplierDto {
  id: number;
  supplierName: string;
  supplierCodeName: string;
  supplierShortCode: string;
}

export interface AddSupplierDto{
  supplierName: string;
  supplierCodeName: string;
  supplierShortCode: string;
  formula: string;
}