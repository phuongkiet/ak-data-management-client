export interface ProductSurfaceDto {
  id: number;
  name: string;
  shortCode: string;
  description: string | null;
}

export interface AddSurfaceDto {
  name: string;
  shortCode: string,
  description: string | null;
}

export interface UpdateSurfaceDto {
  name: string;
  shortCode: string,
  description: string | null;
}


