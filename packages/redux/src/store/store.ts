import { configureStore, EnhancedStore, ThunkAction, Action } from "@reduxjs/toolkit";

import { collectionSlice } from "./collection";
import { settingsSlice } from "./settings";
import { walletSlice } from "./wallet";

/* javascript-obfuscator:disable */
const isProductionNodeEnv = process.env.NODE_ENV === "production";
/* javascript-obfuscator:enable */

export interface IStore {
  collection: ReturnType<typeof collectionSlice.reducer>;
  settings: ReturnType<typeof settingsSlice.reducer>;
  wallet: ReturnType<typeof walletSlice.reducer>;
}

export const store: EnhancedStore<IStore> = configureStore({
  reducer: {
    [collectionSlice.name]: collectionSlice.reducer,
    [settingsSlice.name]: settingsSlice.reducer,
    [walletSlice.name]: walletSlice.reducer,
  },
  devTools: !isProductionNodeEnv,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
