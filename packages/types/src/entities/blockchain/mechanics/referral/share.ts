import type { IIdDateBase } from "@gemunion/types-collection";
import { IReferralEvents } from "./reward";
import { IReferralTree } from "./tree";
import { IReferralClaim } from "./claim";

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
