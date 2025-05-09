export interface ProductAntiSlipperyDto {
  id: number;
  antiSlipLevel: string;
  description: string | null;
}

export interface AddAntiSlipperyDto {
  antiSlipLevel: string;
  description: string | null;
}

export interface UpdateAntiSlipperyDto {
  antiSlipLevel: string;
  description: string | null;
}


