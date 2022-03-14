import { EnabledLanguages } from "@gemunion/framework-constants";

export interface IUserCommonDto {
  displayName?: string;
  language?: EnabledLanguages;
  phoneNumber?: string;
  imageUrl?: string;
  email?: string;
}
