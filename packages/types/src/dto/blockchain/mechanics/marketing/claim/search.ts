import type { IPaginationDto } from "@ethberry/types-collection";

import { ClaimStatus, ClaimType } from "../../../../../entities";

export interface IClaimSearchDto extends IPaginationDto {
  account: string;
  claimStatus: Array<ClaimStatus>;
  claimType: Array<ClaimType>;

  chainId: number;
  merchantId: number;
}
