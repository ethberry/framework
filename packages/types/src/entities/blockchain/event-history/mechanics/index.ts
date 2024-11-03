// import {  } from "./breed";
import { CollectionEventType, TCollectionEvents } from "./collection";
import { DiscreteEventType, TDiscreteEvents } from "./discrete";
import { RentableEventType, TRentableEvents } from "./rentable";
import { LootEventType, TLootEvents } from "./loot";
import { LotteryEventType, TLotteryEvents } from "./lottery";
import { MysteryEventType, TMysteryEvents } from "./mystery";
import { PaymentSplitterEventType, TPaymentSplitterEvents } from "./payment-splitter";
import { PonziEventType, TPonziEvents } from "./ponzi";
import { RaffleEventType, TRaffleEvents } from "./raffle";
import { ReferralProgramEventType, TReferralProgramEvents } from "./referral";
import { StakingEventType, TStakingEvents } from "./staking";
import { TLegacyVestingEvents, LegacyVestingEventType } from "./legacy-vesting";
import { TWaitListEvents, WaitListEventType } from "./wait-list";
import { TWrapperEvents, WrapperEventType } from "./wrapper";
import { TVestingEvents, VestingEventType } from "./vesting";

export * from "./collection";
export * from "./discrete";
export * from "./rentable";
export * from "./loot";
export * from "./lottery";
export * from "./mystery";
export * from "./payment-splitter";
export * from "./ponzi";
export * from "./raffle";
export * from "./referral";
export * from "./staking";
export * from "./legacy-vesting";
export * from "./vesting";
export * from "./wait-list";
export * from "./wrapper";

export type TMechanicsEventType =
  | CollectionEventType
  | DiscreteEventType
  | RentableEventType
  | LootEventType
  | LotteryEventType
  | MysteryEventType
  | PaymentSplitterEventType
  | PonziEventType
  | RaffleEventType
  | ReferralProgramEventType
  | StakingEventType
  | LegacyVestingEventType
  | VestingEventType
  | WaitListEventType
  | WrapperEventType;

export type TMechanicsEventData =
  | TCollectionEvents
  | TDiscreteEvents
  | TRentableEvents
  | TLootEvents
  | TLotteryEvents
  | TMysteryEvents
  | TPaymentSplitterEvents
  | TPonziEvents
  | TRaffleEvents
  | TReferralProgramEvents
  | TStakingEvents
  | TLegacyVestingEvents
  | TVestingEvents
  | TWaitListEvents
  | TWrapperEvents;
