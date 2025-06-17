import {createContext, useContext} from "react";
import CommonStore from "./commonStore.ts";
import UserStore from "./userStore.ts";
import ProductStore from './productStore.ts'
import SupplierStore from './supplierStore.ts'
import MaterialStore from './materialStore.ts'
import SurfaceStore from './surfaceStore.ts'
import PatternStore from './patternStore.ts'
import SizeStore from './sizeStore.ts'
import ColorStore from './colorStore.ts'
import BodyColorStore from './bodyColorStore.ts'
import AntiSlipperyStore from './antiSlipperyStore.ts'
import WaterAbsorptionStore from './waterAbsorptionStore.ts'
import OriginStore from './originStore.ts'
import ProcessingStore from './processingStore.ts'
import CompanyCodeStore from './companyCodeStore.ts'
import StorageStore from './storageStore.ts'
import CalculatedUnitStore from './calculatedUnitStore.ts'
import FactoryStore from "./factoryStore.ts";
import AreaStore from "./areaStore.ts";
import SupplierTaxStore from "./supplierTaxStore.ts";
import RoleStore from "./roleStore.ts";
import LinkStorageStore from "./linkStorageStore.ts";
interface Store {
  userStore: UserStore;
  commonStore: CommonStore;
  productStore: ProductStore;
  supplierStore: SupplierStore;
  materialStore: MaterialStore;
  surfaceStore: SurfaceStore;
  patternStore: PatternStore;
  sizeStore: SizeStore;
  colorStore: ColorStore;
  bodyColorStore: BodyColorStore;
  antiSlipperyStore: AntiSlipperyStore;
  waterAbsorptionStore: WaterAbsorptionStore;
  originStore: OriginStore;
  processingStore: ProcessingStore;
  companyCodeStore: CompanyCodeStore;
  storageStore: StorageStore;
  calculatedUnitStore: CalculatedUnitStore;
  factoryStore: FactoryStore;
  areaStore: AreaStore;
  supplierTaxStore: SupplierTaxStore;
  roleStore: RoleStore;
  linkStorageStore: LinkStorageStore;
}

export const store: Store = {
  userStore: new UserStore(),
  commonStore: new CommonStore(),
  productStore: new ProductStore(),
  supplierStore: new SupplierStore(),
  materialStore: new MaterialStore(),
  surfaceStore: new SurfaceStore(),
  patternStore: new PatternStore(),
  sizeStore: new SizeStore(),
  colorStore: new ColorStore(),
  bodyColorStore: new BodyColorStore(),
  antiSlipperyStore: new AntiSlipperyStore(),
  waterAbsorptionStore: new WaterAbsorptionStore(),
  originStore: new OriginStore(),
  processingStore: new ProcessingStore(),
  companyCodeStore: new CompanyCodeStore(),
  storageStore: new StorageStore(),
  calculatedUnitStore: new CalculatedUnitStore(),
  factoryStore: new FactoryStore(),
  areaStore: new AreaStore(),
  supplierTaxStore: new SupplierTaxStore(),
  roleStore: new RoleStore(),
  linkStorageStore: new LinkStorageStore()
}

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}