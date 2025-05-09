export interface ProductColorDto {
  id: number;
  name: string;
  colorHexCode: string | null;
}

export interface AddColorDto {
  name: string;
  colorHexCode: string | null;
}

export interface UpdateColorDto {
  name: string;
  colorHexCode: string | null;
}
