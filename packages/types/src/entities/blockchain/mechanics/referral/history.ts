import type { IIdDateBase } from "@gemunion/types-collection";

export enum ReferralProgramEventType {
  ReferralProgram = "ReferralProgram",
  ReferralReward = "ReferralReward",
  ReferralWithdraw = "ReferralWithdraw",
}

export type IReferralProgram = [string, string, string, boolean];

export interface IRProgram {
  refProgram: IReferralProgram;
}

export interface IReward {
  account: string;
  referrer: string;
  level: number;
  token: string;
  amount: string;
}

export interface IWithdraw {
  account: string;
  token: string;
  amount: string;
}

export type TReferralEventData = IRProgram | IReward | IWithdraw;

export interface IReferralHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ReferralProgramEventType;
  eventData: TReferralEventData;
}
