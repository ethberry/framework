import { EnabledLanguages } from "@framework/constants";

// @ts-ignore
import ar from "../i18n/ar.json";
// @ts-ignore
import en from "../i18n/en.json";
// @ts-ignore
import ru from "../i18n/ru.json";

export const i18n: Record<EnabledLanguages, any> = {
  [EnabledLanguages.AR]: ar,
  [EnabledLanguages.EN]: en,
  [EnabledLanguages.RU]: ru,
};
