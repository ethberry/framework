import type { IIdDateBase } from "@gemunion/types-collection";

import type { IClaim } from "../../marketing";
import type { IReferralRewardShare } from "./share";

export interface IReferralClaim extends IIdDateBase {
  account: string;
  shares: Array<IReferralRewardShare>;
  claimId: number | null;
  claim?: IClaim;
}
