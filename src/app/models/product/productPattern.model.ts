export interface ProductPatternDto {
  id: number;
  name: string;
  shortCode: string;
  shortName: string;
  description: string | null;
}

export interface AddPatternDto {
  name: string;
  shortCode: string;
  shortName: string;
  description: string | null;
}

export interface UpdatePatternDto {
  name: string;
  shortCode: string;
  shortName: string;
  description: string | null;
}
