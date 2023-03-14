import { EnabledLanguages } from "@framework/constants";

// @ts-ignore
import ar from "../i18n/ar.json";
// @ts-ignore
import countriesAr from "../i18n/ar/countries.json";
// @ts-ignore
import en from "../i18n/en.json";
// @ts-ignore
import countriesEn from "../i18n/en/countries.json";
// @ts-ignore
import ru from "../i18n/ru.json";
// @ts-ignore
import countriesRu from "../i18n/ru/countries.json";

en.enums.country = countriesEn;
ar.enums.country = countriesAr;
ru.enums.country = countriesRu;

export const i18n: Record<EnabledLanguages, any> = {
  [EnabledLanguages.AR]: ar,
  [EnabledLanguages.EN]: en,
  [EnabledLanguages.RU]: ru,
  [EnabledLanguages.AR]: ar,
};
