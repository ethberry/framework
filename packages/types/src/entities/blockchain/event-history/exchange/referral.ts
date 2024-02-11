import { IAssetItem } from "./common";

export enum ReferralProgramEventType {
  ReferralEvent = "ReferralEvent",
  ReferralProgram = "ReferralProgram",
  ReferralReward = "ReferralReward",
  ReferralWithdraw = "ReferralWithdraw",
  ReferralBonus = "ReferralBonus",
}

// export type IReferralProgram = [string, string, string, boolean];
export interface IReferralProgramData {
  _refReward: string;
  _refDecrease: string;
  _maxRefs: string;
  init: boolean;
}

export interface IRProgram {
  refProgram: IReferralProgramData;
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

export interface IReferralEvent {
  account: string;
  referrer: string;
  price: Array<IAssetItem>;
}

// TODO rename events
export type TReferralEventData = IRProgram | IReferralRewardEvent | IReferralWithdrawEvent | IBonus | IReferralEvent;
