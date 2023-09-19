import type { IMerchantSocial } from "@framework/types";

export interface IMerchantCreateDto {
  title: string;
  description: string;
  email: string;
  wallet: string;
  phoneNumber: string;
  imageUrl: string;
  social: IMerchantSocial;
}
