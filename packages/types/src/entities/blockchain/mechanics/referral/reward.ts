import type { IIdDateBase } from "@gemunion/types-collection";
import { IContract } from "../../hierarchy/contract";

export interface IReferralReward extends IIdDateBase {
  account: string;
  referrer: string;
  level: number;
  amount: string;
  contractId: number | null;
  contract?: IContract;
}
