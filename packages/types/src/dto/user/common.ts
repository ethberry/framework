import { EnabledLanguages } from "@framework/constants";

export interface IUserCommonDto {
  displayName?: string;
  language?: EnabledLanguages;
  imageUrl?: string;
  email?: string;
}
