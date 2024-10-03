import type { IAssetItem } from "../exchange/common";

export enum ReferralProgramEventType {
  ReferralEvent = "ReferralEvent",
}

export enum ReferralProgramEventSignature {
  ReferralEvent = "ReferralEvent(address,address,(uint8,address,uint256,uint256)[])",
}

export interface IReferralProgramEvent {
  account: string;
  referrer: string;
  price: Array<IAssetItem>;
}

export type TReferralProgramEvents = IReferralProgramEvent;
