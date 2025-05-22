import { ProductSupplierDto } from './productSupplier.model';
import { ProductSizeDto } from './productSize.model';
import { ProductPatternDto } from './productPattern.model';
import { ProductSurfaceDto } from './productSurface.model';
import { ProductMaterialDto } from './productMaterial.model';
import { ProductColorDto } from './productColor.model';
import { CalculatedUnitDto } from './calculatedUnit.model';

export interface BaseProductProps {
  isCreateMode: boolean;
}

export interface MaterialGroupProps extends BaseProductProps {
  materials: ProductMaterialDto[];
}

export interface SupplierGroupProps extends BaseProductProps {
  suppliers: ProductSupplierDto[];
}

export interface SizeGroupProps extends BaseProductProps {
  sizes: ProductSizeDto[];
  calculatedUnits: CalculatedUnitDto[];
  thicknessError: string;
  setThicknessError: (error: string) => void;
}

export interface SurfaceGroupProps extends BaseProductProps {
  surfaces: ProductSurfaceDto[];
}

export interface PatternGroupProps extends BaseProductProps {
  patterns: ProductPatternDto[];
}

export interface ColorGroupProps extends BaseProductProps {
  colors: ProductColorDto[];
} 