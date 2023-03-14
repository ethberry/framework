import { MerchantStatus } from "@framework/types";
import { IMerchantCreateDto } from "./create";

export interface IMerchantUpdateDto extends IMerchantCreateDto {
  merchantStatus: MerchantStatus;
}
