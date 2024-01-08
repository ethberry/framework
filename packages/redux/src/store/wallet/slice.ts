import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { useApiCall } from "@gemunion/react-hooks";

import { STORE_CONNECTOR } from "./constants";
import { emptyWalletState } from "./empty";
import type { INetwork, IWalletState, TConnectors } from "./interfaces";

const initialState: IWalletState = emptyWalletState;

const fetchWallets = createAsyncThunk("wallet/fetchWallets", async () => {
  const { fn } = useApiCall(
    api =>
      api.fetchJson({
        url: "/wallets",
      }),
    { success: false, error: false },
  );
  return fn();
});

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setIsDialogOpen(state, action: PayloadAction<boolean>) {
      state.isDialogOpen = action.payload;
    },
    setActiveConnector(state, action: PayloadAction<TConnectors | null>) {
      state.activeConnector = action.payload;
      localStorage.setItem(STORE_CONNECTOR, JSON.stringify(action.payload));
    },
    setNetwork(state, action: PayloadAction<INetwork | null>) {
      state.network = action.payload;
    },
    setWallets(state, action: PayloadAction<any[]>) {
      state.wallets = action.payload;
    },
    setActiveWallets(state, action: PayloadAction<any[]>) {
      state.activeWallets = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchWallets.fulfilled, (state, action) => {
      state.wallets = action.payload;
    });
  },
});

export const walletActions = walletSlice.actions;
