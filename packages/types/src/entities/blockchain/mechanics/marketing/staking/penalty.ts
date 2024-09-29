import type { IIdDateBase } from "@ethberry/types-collection";

import type { IAsset } from "../../../exchange/asset";
import type { IContract } from "../../../hierarchy/contract";

export interface IStakingPenalty extends IIdDateBase {
  stakingId: number;
  staking?: IContract;
  penaltyId: number;
  penalty?: IAsset;
}
