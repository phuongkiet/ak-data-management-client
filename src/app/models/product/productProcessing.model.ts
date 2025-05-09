export interface ProductProcessingDto {
  id: number;
  processingCode: string;
  processingDescription: string | null;
}

export interface AddProcessingDto {
  processingCode: string;
  processingDescription: string | null;
}

export interface UpdateProcessingDto {
  processingCode: string;
  processingDescription: string | null;
}


