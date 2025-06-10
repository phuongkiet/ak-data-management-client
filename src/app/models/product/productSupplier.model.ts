
export interface ProductSupplierDto {
  id: number;
  supplierName: string;
  supplierCodeName: string;
  supplierShortCode: string;
}

export interface SupplierDetailDto{
  id: number;
  supplierName: string;
  supplierCodeName: string;
  supplierShortCode: string;
  shippingFee: number | null;
  discount: number | null;
  priceDiscountAtStorage: number | null;
  percentageOfFastPayment: number | null;
  amountOfFastPayment: number | null;
  percentageQuarterlySales: number | null;
  percentageYearSales: number | null;
  percentageChangeQuantity: number | null;
  percentageReturnQuantity: number | null;
  dateAmountOfChange: string | null; // Cân nhắc kiểu Date nếu cần xử lý Date object trong TS
  dateAmountOfReturn: string | null; // Cân nhắc kiểu Date nếu cần xử lý Date object trong TS
  productDocumentation: string | null;
  startDateOfContract: string | null; // Cân nhắc kiểu Date nếu cần xử lý Date object trong TS
  endDateOfContract: string | null; // Cân nhắc kiểu Date nếu cần xử lý Date object trong TS
  remainingDate: string | null;
  warning: string | null;
  otherNote: string | null;
  supplierStorageAddress: string | null;
  firstContactInfomation: string | null;
  secondContactInfomation: string | null;
  taxId: number | null;
  supplierFactories: number[];
  productServices: number | null;
}

export interface AddSupplierDto{
  supplierName: string;
  supplierCodeName: string;
  supplierShortCode: string;
}

export interface UpdateSupplierDto{
  supplierName: string;
  supplierCodeName: string;
  supplierShortCode: string;
}

export interface UpdateSupplierForStrategyDto{
  supplierName: string;
  supplierCodeName: string;
  supplierShortCode: string;
  shippingFee: number | null;
  discount: number | null;
  priceDiscountAtStorage: number | null;
  percentageOfFastPayment: number | null;
  amountOfFastPayment: number | null;
  percentageQuarterlySales: number | null;
  percentageYearSales: number | null;
  percentageChangeQuantity: number | null;
  percentageReturnQuantity: number | null;
  dateAmountOfChange: string | null; // Cân nhắc kiểu Date nếu cần xử lý Date object trong TS
  dateAmountOfReturn: string | null; // Cân nhắc kiểu Date nếu cần xử lý Date object trong TS
  productDocumentation: string | null;
  startDateOfContract: string | null; // Cân nhắc kiểu Date nếu cần xử lý Date object trong TS
  endDateOfContract: string | null; // Cân nhắc kiểu Date nếu cần xử lý Date object trong TS
  remainingDate: string | null;
  warning: string | null;
  otherNote: string | null;
  supplierStorageAddress: string | null;
  firstContactInfomation: string | null;
  secondContactInfomation: string | null;
  taxId: number | null;
  supplierFactories: number[];
  productServices: number | null;
}