export interface ProductMaterialDto {
  id: number;
  name: string;
  shortName: string;
  description: string | null;
}

export interface AddMaterialDto {
  name: string;
  shortName: string;
  description: string | null;
}

export interface UpdateMaterialDto {
  name: string;
  shortName: string;
  description: string | null;
}
