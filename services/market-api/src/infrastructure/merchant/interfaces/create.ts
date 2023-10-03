import type { ISearchableDto } from "@gemunion/types-collection";
import type { IMerchantSocial } from "@framework/types";

export interface IMerchantCreateDto extends ISearchableDto {
  email: string;
  wallet: string;
  phoneNumber: string;
  imageUrl: string;
  social: IMerchantSocial;
}
