export interface ProductSurfaceDto {
  id: number;
  name: string;
  description: string | null;
}

export interface AddSurfaceDto {
  name: string;
  description: string | null;
}

export interface UpdateSurfaceDto {
  name: string;
  description: string | null;
}


