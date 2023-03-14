import { EnabledLanguages } from "@framework/constants";

// @ts-ignore
import en from "../i18n/en.json";
// @ts-ignore
import ru from "../i18n/ru.json";

export const i18n: Record<EnabledLanguages, any> = {
  [EnabledLanguages.EN]: en,
  [EnabledLanguages.RU]: ru,
};
