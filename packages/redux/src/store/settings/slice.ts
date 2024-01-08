import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { RTLLanguages, ThemeType } from "@gemunion/constants";

import { emptySettingsState } from "./empty";
import { LAYOUT_DIRECTION, ISettingsState } from "./interfaces";
import type { TLanguage } from "./interfaces";

const localSettingsState = localStorage.getItem("settings");
const initialState: ISettingsState = localSettingsState !== null ? JSON.parse(localSettingsState) : emptySettingsState;

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<TLanguage>) {
      state.language = action.payload;
      state.layoutDirection = state.language === RTLLanguages.AR ? LAYOUT_DIRECTION.rtl : LAYOUT_DIRECTION.ltr;
      localStorage.setItem("settings", JSON.stringify(state));
    },
    setLayoutDirection(state, action: PayloadAction<LAYOUT_DIRECTION>) {
      state.layoutDirection = action.payload;
      localStorage.setItem("settings", JSON.stringify(state));
    },
    setThemeType(state, action: PayloadAction<ThemeType>) {
      state.themeType = action.payload;
      localStorage.setItem("settings", JSON.stringify(state));
    },
    setReferrer(state, action: PayloadAction<string>) {
      state.referrer = action.payload;
      localStorage.setItem("settings", JSON.stringify(state));
    },
  },
});

export const settingsActions = settingsSlice.actions;
