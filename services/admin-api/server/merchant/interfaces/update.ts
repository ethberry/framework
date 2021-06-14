import {MerchantStatus} from "@trejgun/solo-types";
import {IMerchantCreateDto} from "./create";

export interface IMerchantUpdateDto extends IMerchantCreateDto {
  merchantStatus: MerchantStatus;
}
