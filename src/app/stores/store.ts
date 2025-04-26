import {createContext, useContext} from "react";
import CommonStore from "./commonStore.ts";
import UserStore from "./userStore.ts";
import ProductStore from './productStore.ts'

interface Store {
  userStore: UserStore;
  commonStore: CommonStore;
  productStore: ProductStore;
}

export const store: Store = {
  userStore: new UserStore(),
  commonStore: new CommonStore(),
  productStore: new ProductStore(),
}

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}