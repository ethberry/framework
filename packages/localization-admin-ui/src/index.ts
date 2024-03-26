import { EnabledLanguages } from "@framework/constants";

// @ts-ignore
import ar from "../i18n/ar.json";
// @ts-ignore
import countriesAr from "../i18n/ar/countries.json";
// @ts-ignore
import schedulesAr from "../i18n/ar/schedule.json";
// @ts-ignore
import en from "../i18n/en.json";
// @ts-ignore
import countriesEn from "../i18n/en/countries.json";
// @ts-ignore
import schedulesEn from "../i18n/en/schedule.json";
// @ts-ignore
import id from "../i18n/id.json";
// @ts-ignore
import countriesId from "../i18n/id/countries.json";
// @ts-ignore
import schedulesId from "../i18n/id/schedule.json";
// @ts-ignore
import ru from "../i18n/ru.json";
// @ts-ignore
import countriesRu from "../i18n/ru/countries.json";
// @ts-ignore
import schedulesRu from "../i18n/ru/schedule.json";

ar.enums.country = countriesAr;
ar.enums.schedule = schedulesAr;

id.enums.country = countriesId;
id.enums.schedule = schedulesId;

en.enums.country = countriesEn;
en.enums.schedule = schedulesEn;

ru.enums.country = countriesRu;
ru.enums.schedule = schedulesRu;

export const i18n: Record<EnabledLanguages, any> = {
  [EnabledLanguages.AR]: ar,
  [EnabledLanguages.ID]: id,
  [EnabledLanguages.EN]: en,
  [EnabledLanguages.RU]: ru,
};
