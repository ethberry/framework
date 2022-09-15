import type { IIdDateBase } from "@gemunion/types-collection";

import { IAssetComponentHistory } from "./asset-component-history";

export enum ExchangeEventType {
  Claim = "Claim",
  Craft = "Craft",
  Mysterybox = "Mysterybox",
  Purchase = "Purchase",
  Upgrade = "Upgrade",
  // MODULE:WAITLIST
  RewardSet = "RewardSet",
  ClaimReward = "ClaimReward",
}

export type IExchangeItem = [number, string, string, string];

export interface IExchangePurchaseEvent {
  from: string;
  externalId: string;
  item: IExchangeItem;
  price: Array<IExchangeItem>;
}

// MODULE:CLAIM
export interface IExchangeClaimEvent {
  from: string;
  externalId: string;
  items: IExchangeItem; // TODO array
}

// MODULE:CRAFT
export interface IExchangeCraftEvent {
  from: string;
  externalId: string;
  items: Array<IExchangeItem>;
  price: Array<IExchangeItem>;
}

// MODULE:GRADE
export interface IExchangeGradeEvent {
  from: string;
  externalId: string;
  items: IExchangeItem;
  price: Array<IExchangeItem>;
}

// MODULE:MYSTERYBOX
export interface IExchangeMysteryEvent {
  from: string;
  externalId: string;
  items: IExchangeItem; // TODO array
  price: Array<IExchangeItem>;
}

export type IRewardItem = [number, string, string, string];

export interface IRewardSetEvent {
  externalId: string;
  items: Array<IRewardItem>;
}

export interface IClaimRewardEvent {
  from: string;
  externalId: string;
  items: Array<IRewardItem>;
}

export type TExchangeEventData =
  | IExchangePurchaseEvent
  | IExchangeClaimEvent
  | IExchangeCraftEvent
  | IExchangeGradeEvent
  | IExchangeMysteryEvent
  | IRewardSetEvent
  | IClaimRewardEvent;

export interface IExchangeHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ExchangeEventType;
  eventData: TExchangeEventData;
  assets?: Array<IAssetComponentHistory>;
}
