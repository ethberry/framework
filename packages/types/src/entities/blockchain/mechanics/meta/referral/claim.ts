import type { IIdDateBase } from "@gemunion/types-collection";
import { IClaim } from "../../marketing/claim/claim";
import { IReferralRewardShare } from "./share";

export interface IReferralClaim extends IIdDateBase {
  account: string;
  shares: Array<IReferralRewardShare>;
  claimId: number | null;
  claim?: IClaim;
}
