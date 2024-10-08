import { IExchangeBreedEvent } from "./breeding";
import { IExchangeClaimEvent } from "./claim";
import { IExchangeCraftEvent } from "./craft";
import { IExchangeDiscreteEvent } from "./discrete";
import { IExchangeDismantleEvent } from "./dismantle";
import { IExchangeMergeEvent } from "./merge";
import { IExchangePurchaseMysteryBoxEvent } from "./mystery";
import { IExchangePurchaseEvent } from "./core";
import { IExchangePurchaseLootBoxEvent } from "./loot";
import { IExchangePurchaseLotteryEvent } from "./lottery";
import { IExchangePurchaseRaffleEvent } from "./raffle";
import { IExchangeRentableEvent, IExchangeRentableManyEvent } from "./rentable";

export * from "./common";

export enum ExchangeEventType {
  Purchase = "Purchase",
  PurchaseLottery = "PurchaseLottery",
  PurchaseRaffle = "PurchaseRaffle",
  Claim = "Claim",
  Craft = "Craft",
  Dismantle = "Dismantle",
  Merge = "Merge",
  Lend = "Lend",
  LendMany = "LendMany",
  PurchaseLootBox = "PurchaseLootBox",
  PurchaseMysteryBox = "PurchaseMysteryBox",
  Upgrade = "Upgrade",
  WaitListRewardSet = "WaitListRewardSet",
  WaitListRewardClaimed = "WaitListRewardClaimed",
  Breed = "Breed",
  EcommercePurchase = "EcommercePurchase",
}

export enum ExchangeEventSignature {
  Purchase = "Purchase(address,uint256,(uint8,address,uint256,uint256),(uint8,address,uint256,uint256)[])",
  PurchaseLottery = "PurchaseLottery(address,uint256,(uint8,address,uint256,uint256),(uint8,address,uint256,uint256),uint256,bytes32)",
  PurchaseRaffle = "PurchaseRaffle(address,uint256,(uint8,address,uint256,uint256),(uint8,address,uint256,uint256),uint256,uint256)",
  Claim = "Claim(address,uint256,(uint8,address,uint256,uint256)[])",
  Craft = "Craft(address,uint256,(uint8,address,uint256,uint256)[],(uint8,address,uint256,uint256)[])",
  Dismantle = "Dismantle(address,uint256,(uint8,address,uint256,uint256)[],(uint8,address,uint256,uint256)[])",
  Merge = "Merge(address,uint256,(uint8,address,uint256,uint256)[],(uint8,address,uint256,uint256)[])",
  Lend = "Lend(address,address,uint64,uint256,(uint8,address,uint256,uint256),(uint8,address,uint256,uint256)[])",
  LendMany = "LendMany(address,address,uint64,uint256,(uint8,address,uint256,uint256)[],(uint8,address,uint256,uint256)[])",
  PurchaseLootBox = "PurchaseLootBox(address,uint256,(uint8,address,uint256,uint256)[],(uint8,address,uint256,uint256)[])",
  PurchaseMysteryBox = "PurchaseMysteryBox(address,uint256,(uint8,address,uint256,uint256),(uint8,address,uint256,uint256)[],(uint8,address,uint256,uint256)[])",
  Upgrade = "Upgrade(address,uint256,(uint8,address,uint256,uint256),(uint8,address,uint256,uint256)[],bytes32,uint256)",
  WaitListRewardSet = "WaitListRewardSet(uint256,bytes32,(uint8,address,uint256,uint256)[])",
  WaitListRewardClaimed = "WaitListRewardClaimed(address,uint256,(uint8,address,uint256,uint256)[])",
  Breed = "Breed(address,uint256,(uint8,address,uint256,uint256),(uint8,address,uint256,uint256))",
  EcommercePurchase = "EcommercePurchase(??)",
}

export type TExchangeEvents =
  | IExchangeBreedEvent
  | IExchangeClaimEvent
  | IExchangePurchaseEvent
  | IExchangeCraftEvent
  | IExchangeDiscreteEvent
  | IExchangeDismantleEvent
  | IExchangePurchaseLootBoxEvent
  | IExchangePurchaseLotteryEvent
  | IExchangeMergeEvent
  | IExchangePurchaseMysteryBoxEvent
  | IExchangePurchaseRaffleEvent
  | IExchangeRentableEvent
  | IExchangeRentableManyEvent;

export {
  IExchangeBreedEvent,
  IExchangeClaimEvent,
  IExchangePurchaseEvent,
  IExchangeCraftEvent,
  IExchangeDiscreteEvent,
  IExchangeDismantleEvent,
  IExchangePurchaseLootBoxEvent,
  IExchangePurchaseLotteryEvent,
  IExchangeMergeEvent,
  IExchangePurchaseMysteryBoxEvent,
  IExchangePurchaseRaffleEvent,
  IExchangeRentableEvent,
  IExchangeRentableManyEvent,
};
