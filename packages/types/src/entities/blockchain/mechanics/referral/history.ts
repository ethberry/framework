import type { IIdDateBase } from "@gemunion/types-collection";

export enum ReferralProgramEventType {
  ReferralProgram = "ReferralProgram",
  ReferralReward = "ReferralReward",
  ReferralWithdraw = "ReferralWithdraw",
  ReferralBonus = "ReferralBonus",
}

export type IReferralProgram = [string, string, string, boolean];

export interface IRProgram {
  refProgram: IReferralProgram;
}

export interface IReferralRewardEvent {
  account: string;
  referrer: string;
  level: number;
  token: string;
  amount: string;
}

export interface IReferralWithdrawEvent {
  account: string;
  token: string;
  amount: string;
}

export interface IBonus {
  referrer: string;
  token: string;
  amount: string;
}

export type TReferralEventData = IRProgram | IReferralRewardEvent | IReferralWithdrawEvent | IBonus;

export interface IReferralHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ReferralProgramEventType;
  eventData: TReferralEventData;
}
