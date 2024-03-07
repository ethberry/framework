import type { IPaginationDto } from "@gemunion/types-collection";

import { ClaimStatus, ClaimType } from "../../../../../entities";

export interface IClaimSearchDto extends IPaginationDto {
  account: string;
  claimStatus: Array<ClaimStatus>;
  claimType: Array<ClaimType>;

  chainId: number;
  merchantId: number;
}
