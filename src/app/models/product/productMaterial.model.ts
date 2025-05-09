export interface ProductMaterialDto {
  id: number;
  name: string;
  description: string | null;
}

export interface AddMaterialDto {
  name: string;
  description: string | null;
}

export interface UpdateMaterialDto {
  name: string;
  description: string | null;
}
