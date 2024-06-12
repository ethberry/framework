import type { IIdDateBase } from "@gemunion/types-collection";
import type { IReferralEvents } from "./reward";
import type { IReferralTree } from "./tree";
import type { IReferralClaim } from "./claim";

export interface IReferralRewardShare extends IIdDateBase {
  referrer: string;
  share: number;
  level: number;
  rewardId: number;
  reward: IReferralEvents;
  treeId: number;
  tree: IReferralTree;
  claimId: number | null;
  claim?: IReferralClaim;
}
