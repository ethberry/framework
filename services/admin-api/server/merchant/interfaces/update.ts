import {MerchantStatus} from "@gemunionstudio/solo-types";
import {IMerchantCreateDto} from "./create";

export interface IMerchantUpdateDto extends IMerchantCreateDto {
  merchantStatus: MerchantStatus;
}
