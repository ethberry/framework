import type { IExchangePurchaseEvent } from "./core";
import type { IExchangeClaimEvent } from "./claim";
import type { IExchangePurchaseMysteryBoxEvent } from "./mystery";
import type { IExchangeLendEvent } from "./rentable";
import type { IExchangeCraftEvent } from "./craft";
import type { IExchangeDismantleEvent } from "./dismantle";
import type { IExchangeBreedEvent } from "./breeding";
import type { IExchangePurchaseLotteryEvent } from "./lottery";
import type { IExchangePurchaseRaffleEvent } from "./raffle";
import type { IExchangeDiscreteEvent } from "./discrete";

export enum ExchangeEventType {
  // MODULE:CORE
  Purchase = "Purchase",
  // MODULE:CLAIM
  Claim = "Claim",
  // MODULE:CRAFT
  Craft = "Craft",
  Dismantle = "Dismantle",
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
  ERC20PaymentReleased = "ERC20PaymentReleased",
  PaymentReceived = "PaymentReceived",
  PaymentEthReceived = "PaymentEthReceived",
  PaymentEthSent = "PaymentEthSent",
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
  | IExchangeClaimEvent
  | IExchangeCraftEvent
  | IExchangeDismantleEvent
  | IExchangeDiscreteEvent
  | IExchangePurchaseMysteryBoxEvent
  | IExchangeBreedEvent
  | IExchangePayeeAddedEvent
  | IExchangePaymentReceivedEvent
  | IExchangePaymentReleasedEvent
  | IExchangeErc20PaymentReleasedEvent
  | IExchangeLendEvent
  | IExchangePurchaseLotteryEvent
  | IExchangePurchaseRaffleEvent;
