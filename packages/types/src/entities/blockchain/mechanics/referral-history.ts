import { IIdDateBase } from "@gemunion/types-collection";

export enum ReferralProgramEventType {
  Reward = "Reward",
}

export interface IReward {
  account: string;
  referrer: string;
  level: number;
  amount: string;
}

export type TReferralEventData = IReward;

export interface IReferralHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ReferralProgramEventType;
  eventData: TReferralEventData;
}
