import { EnabledLanguages } from "@gemunion/framework-constants";

// @ts-ignore
import en from "../i18n/en.json";
// @ts-ignore
import ru from "../i18n/ru.json";
// @ts-ignore
import ua from "../i18n/ua.json";

export const i18n: Record<EnabledLanguages, any> = {
  [EnabledLanguages.EN]: en,
  [EnabledLanguages.RU]: ru,
  [EnabledLanguages.UA]: ua,
};
