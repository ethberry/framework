import type { IExchangePurchaseEvent } from "./core";
import type { IExchangePurchaseLootBoxEvent } from "./loot";
import type { IExchangePurchaseLotteryEvent } from "./lottery";
import type { IExchangePurchaseMysteryBoxEvent } from "./mystery";
import type { IExchangePurchaseRaffleEvent } from "./raffle";
import type { IExchangeClaimEvent } from "./claim";
import type { IExchangeLendEvent } from "./rentable";
import type { IExchangeCraftEvent } from "./craft";
import type { IExchangeDismantleEvent } from "./dismantle";
import type { IExchangeBreedEvent } from "./breeding";
import type { IExchangeDiscreteEvent } from "./discrete";

export enum ExchangeEventType {
  // MODULE:CORE
  Purchase = "Purchase",
  // MODULE:CLAIM
  Claim = "Claim",
  // MODULE:CRAFT
  Craft = "Craft",
  Dismantle = "Dismantle",
  // MODULE:LOOT
  PurchaseLootBox = "PurchaseLootBox",
  // MODULE:MYSTERY
  PurchaseMysteryBox = "PurchaseMysteryBox",
  // MODULE:DISCRETE
  Upgrade = "Upgrade",
  // MODULE:LOTTERY
  PurchaseLottery = "PurchaseLottery",
  // MODULE:RAFFLE
  PurchaseRaffle = "PurchaseRaffle",
  // MODULE:BREEDING
  Breed = "Breed",
  // MODULE:RENTABLE
  Lend = "Lend",
  // MODULE:MERGE
  Merge = "Merge",
  // MODULE:PAYMENT_SPLITTER
  PayeeAdded = "PayeeAdded",
  PaymentReleased = "PaymentReleased",
  PaymentReceived = "PaymentReceived",
  ERC20PaymentReleased = "ERC20PaymentReleased",
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

export type TExchangeEvents =
  | IExchangePurchaseEvent
  | IExchangePurchaseLootBoxEvent
  | IExchangePurchaseMysteryBoxEvent
  | IExchangePurchaseLotteryEvent
  | IExchangePurchaseRaffleEvent
  | IExchangeClaimEvent
  | IExchangeCraftEvent
  | IExchangeDismantleEvent
  | IExchangeDiscreteEvent
  | IExchangeBreedEvent
  | IExchangePayeeAddedEvent
  | IExchangePaymentReceivedEvent
  | IExchangePaymentReleasedEvent
  | IExchangeErc20PaymentReleasedEvent
  | IExchangeLendEvent;
