import { EnabledLanguages } from "@framework/constants";
import { EnabledCountries, EnabledGenders } from "@ethberry/constants";

export interface IUserCommonDto {
  displayName?: string;
  language?: EnabledLanguages;
  imageUrl?: string;
  email?: string;
  country?: EnabledCountries;
  gender?: EnabledGenders;
}
