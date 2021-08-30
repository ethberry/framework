import { EnabledLanguages } from "@gemunion/framework-constants-misc";

export interface IUserCommonDto {
  firstName?: string;
  lastName?: string;
  language?: EnabledLanguages;
  phoneNumber?: string;
  imageUrl?: string;
  email?: string;
}
