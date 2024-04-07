'use client'

import { createContext, useContext } from "react";
import { createStore, useStore as useZustandStore } from "zustand";
import { PreloadedStoreInterface } from "./StoreProvider";
import { DefaultOptionType } from "antd/es/select";

export interface StoreInterface {
  lastUpdate: number;

  createDialogOpen: boolean
  settingPanelOpen: boolean

  theme: 'light' | 'dark';

  categoryList: DefaultOptionType[];
  setCategoryList: (categoryList: DefaultOptionType[]) => void;
  tagOptions: DefaultOptionType[];
  setTagOptions: (tagOptions: DefaultOptionType[]) => void;

  changeCreateDialogOpen: (open: boolean) => void;
  changeSettingPanelOpen: (open: boolean) => void;

  setTheme: (theme: 'light' | 'dark') => void;
}

function getDefaultInitialState() {
  return {
    lastUpdate: new Date(1970, 1, 1).getTime(),

    categoryList: [] as DefaultOptionType[],
    tagOptions: [] as DefaultOptionType[],
    theme: 'light',

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
    setCategoryList: (opts) =>
      set({
        categoryList: opts,
      }),
    setTagOptions: (opts) =>
      set({
        tagOptions: opts,
      }),
    setTheme: (t) =>
      set({
        theme: t,
      }),
  }));
}
