import { IMerchantSocial } from "@framework/types";

export interface IMerchantUpdateDto {
  title: string;
  description: string;
  email: string;
  wallet: string;
  phoneNumber: string;
  imageUrl: string;
  social: IMerchantSocial;
}
