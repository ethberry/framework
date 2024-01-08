import { EnabledLanguages } from "@gemunion/constants";

import { LAYOUT_DIRECTION } from "./interfaces";

export const emptySettingsState = {
  language: EnabledLanguages.EN,
  layoutDirection: LAYOUT_DIRECTION.ltr,
  themeType: "light",
  referrer: "",
};
