'use client'

import { createContext, useContext } from "react";
import { createStore, useStore as useZustandStore } from "zustand";
import { PreloadedStoreInterface } from "./StoreProvider";
import { DefaultOptionType } from "antd/es/select";

export interface StoreInterface {
  lastUpdate: number;

  createDialogOpen: boolean
  settingPanelOpen: boolean

  categoryList: DefaultOptionType[];
  setCategoryList: (categoryList: DefaultOptionType[]) => void;

  changeCreateDialogOpen: (open: boolean) => void;
  changeSettingPanelOpen: (open: boolean) => void;
}

function getDefaultInitialState() {
  return {
    lastUpdate: new Date(1970, 1, 1).getTime(),

    categoryList: [] as DefaultOptionType[],

    createDialogOpen: false,
    settingPanelOpen: false,
  } as const;
}

export type StoreType = ReturnType<typeof initializeStore>;

const storeContext = createContext<StoreType | null>(null);

export const Provider = storeContext.Provider;

export function useStore<T>(selector: (state: StoreInterface) => T) {
  const store = useContext(storeContext);

  if (!store) throw new Error("Store is missing the provider");

  return useZustandStore(store, selector);
}

export function initializeStore(preloadedState: PreloadedStoreInterface) {
  return createStore<StoreInterface>((set, get) => ({
    ...getDefaultInitialState(),
    ...preloadedState,
    changeCreateDialogOpen: (open) =>
      set({
        createDialogOpen: open,
      }),
    changeSettingPanelOpen: (open) =>
      set({
        settingPanelOpen: open,
      }),
    setCategoryList: (open) =>
      set({
        categoryList: open,
      }),
  }));
}
