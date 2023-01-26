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
  // MODULE:BREEDING
  Breed = "Breed",
  // MODULE:WALLET
  PayeeAdded = "PayeeAdded",
  PaymentReleased = "PaymentReleased",
  ERC20PaymentReleased = "ERC20PaymentReleased",
  PaymentReceived = "PaymentReceived",
  PaymentEthReceived = "PaymentEthReceived",
  PaymentEthSent = "PaymentEthSent",
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
  items: Array<IExchangeItem>;
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
  item: IExchangeItem;
  price: Array<IExchangeItem>;
}

// MODULE:MYSTERYBOX
export interface IExchangeMysteryEvent {
  from: string;
  externalId: string;
  items: IExchangeItem; // TODO array
  price: Array<IExchangeItem>;
}

// MODULE:WALLET
export interface IExchangePayeeAddedEvent {
  account: string;
  shares: string;
  externalId: 0;
}

export interface IExchangePaymentReceivedEvent {
  from: string;
  amount: string;
  externalId: 0;
}

export interface IExchangePaymentReleasedEvent {
  to: string;
  amount: string;
  externalId: 0;
}

export interface IExchangeErc20PaymentReleasedEvent {
  token: string;
  to: string;
  amount: string;
  externalId: 0;
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

// MODULE:BREEDING
export interface IExchangeBreedEvent {
  from: string;
  externalId: string;
  matron: IExchangeItem;
  sire: IExchangeItem;
}

export type TExchangeEventData =
  | IExchangePurchaseEvent
  | IExchangeClaimEvent
  | IExchangeCraftEvent
  | IExchangeGradeEvent
  | IExchangeMysteryEvent
  | IRewardSetEvent
  | IClaimRewardEvent
  | IExchangeBreedEvent
  | IExchangePayeeAddedEvent
  | IExchangePaymentReceivedEvent
  | IExchangePaymentReleasedEvent
  | IExchangeErc20PaymentReleasedEvent;

export interface IExchangeHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ExchangeEventType;
  eventData: TExchangeEventData;
  assets?: Array<IAssetComponentHistory>;
}
