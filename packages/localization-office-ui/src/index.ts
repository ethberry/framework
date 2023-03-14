import { EnabledLanguages } from "@framework/constants";

// @ts-ignore
import en from "../i18n/en.json";
// @ts-ignore
import ru from "../i18n/ru.json";
// @ts-ignore
import ar from "../i18n/ar.json";

export const i18n: Record<EnabledLanguages, any> = {
  [EnabledLanguages.EN]: en,
  [EnabledLanguages.RU]: ru,
  [EnabledLanguages.AR]: ar,
};
