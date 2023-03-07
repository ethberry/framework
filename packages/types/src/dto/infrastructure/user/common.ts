import { EnabledLanguages } from "@framework/constants";
import { EnabledCountries, EnabledGenders } from "@gemunion/constants";

export interface IUserCommonDto {
  displayName?: string;
  language?: EnabledLanguages;
  imageUrl?: string;
  email?: string;
  country?: EnabledCountries;
  gender?: EnabledGenders;
}
