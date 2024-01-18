import { MerchantStatus, RatePlanType } from "@framework/types";

import type { IMerchantCreateDto } from "./create";

export interface IMerchantUpdateDto extends IMerchantCreateDto {
  merchantStatus: MerchantStatus;
  ratePlan?: RatePlanType;
}
