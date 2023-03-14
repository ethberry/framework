import type { IPaginationDto } from "@gemunion/types-collection";

import { ClaimStatus } from "../../../../entities";

export interface IClaimSearchDto extends IPaginationDto {
  account: string;
  claimStatus: Array<ClaimStatus>;
  templateIds: Array<number>;
  merchantId: number;
}
