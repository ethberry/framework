import { EnabledLanguages, RTLLanguages, ThemeType } from "@gemunion/constants";

export interface ISettingsProviderProps<T extends string> {
  defaultLanguage?: T;
  defaultLayoutDirection?: LAYOUT_DIRECTION;
  defaultThemeType?: ThemeType;
  defaultReferrer?: string;
  storageName?: string;
}

export enum LAYOUT_DIRECTION {
  ltr = "ltr",
  rtl = "rtl",
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type TLanguage = EnabledLanguages | RTLLanguages;

export interface ISettingsState {
  language: TLanguage;
  layoutDirection: LAYOUT_DIRECTION;
  themeType: ThemeType;
  referrer: string;
}
