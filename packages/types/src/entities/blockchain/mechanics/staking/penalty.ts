import type { IIdDateBase } from "@gemunion/types-collection";

import { IAsset } from "../../exchange/asset";
import { IContract } from "../../hierarchy/contract";

export interface IStakingPenalty extends IIdDateBase {
  stakingId: number;
  staking?: IContract;
  penaltyId: number;
  penalty?: IAsset;
}
