import { MerchantStatus } from "@gemunionstudio/framework-types";
import { IMerchantCreateDto } from "./create";

export interface IMerchantUpdateDto extends IMerchantCreateDto {
  merchantStatus: MerchantStatus;
}
