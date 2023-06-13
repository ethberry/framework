import type { IExchangePurchaseEvent } from "./core";
import type { IExchangeClaimEvent } from "./claim";
import type { IExchangePurchaseMysteryEvent } from "./mystery";
import type { IExchangeLendEvent } from "./rentable";
import type { IExchangeCraftEvent } from "./craft";
import type { IExchangeBreedEvent } from "./breeding";
import type { IExchangePurchaseLotteryEvent } from "./lottery";
import type { IExchangePurchaseRaffleEvent } from "./raffle";
import type { IExchangeGradeEvent } from "./grade";
import type { IClaimRewardEvent, IRewardSetEvent } from "./waitlist";

export enum ExchangeEventType {
  // MODULE:CORE
  Purchase = "Purchase",
  // MODULE:CLAIM
  Claim = "Claim",
  // MODULE:CRAFT
  Craft = "Craft",
  // MODULE:MYSTERY
  Mysterybox = "Mysterybox",
  // MODULE:GRADE
  Upgrade = "Upgrade",
  // MODULE:LOTTERY
  PurchaseLottery = "PurchaseLottery",
  // MODULE:RAFFLE
  PurchaseRaffle = "PurchaseRaffle",
  // MODULE:WAITLIST
  RewardSet = "RewardSet",
  ClaimReward = "ClaimReward",
  // MODULE:BREEDING
  Breed = "Breed",
  // MODULE:RENTABLE
  Lend = "Lend",
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
  | IExchangeGradeEvent
  | IExchangePurchaseMysteryEvent
  | IRewardSetEvent
  | IClaimRewardEvent
  | IExchangeBreedEvent
  | IExchangePayeeAddedEvent
  | IExchangePaymentReceivedEvent
  | IExchangePaymentReleasedEvent
  | IExchangeErc20PaymentReleasedEvent
  | IExchangeLendEvent
  | IExchangePurchaseLotteryEvent
  | IExchangePurchaseRaffleEvent;