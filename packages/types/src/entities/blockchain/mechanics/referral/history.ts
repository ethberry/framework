import { IIdDateBase } from "@gemunion/types-collection";

export enum ReferralProgramEventType {
  ReferralReward = "ReferralReward",
  ReferralWithdraw = "ReferralWithdraw",
}

export interface IReward {
  account: string;
  referrer: string;
  level: number;
  amount: string;
}

export interface IWithdraw {
  account: string;
  amount: string;
}

export type TReferralEventData = IReward | IWithdraw;

export interface IReferralHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ReferralProgramEventType;
  eventData: TReferralEventData;
}
