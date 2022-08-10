import { IIdDateBase } from "@gemunion/types-collection";

export interface IReferralReward extends IIdDateBase {
  account: string;
  referrer: string;
  level: number;
  amount: string;
}
