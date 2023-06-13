import { IAssetStruct } from "./staking";

export enum PyramidEventType {
  RuleCreated = "RuleCreated",
  RuleUpdated = "RuleUpdated",
  StakingStart = "StakingStart",
  StakingWithdraw = "StakingWithdraw",
  StakingFinish = "StakingFinish",
  WithdrawToken = "WithdrawToken",
  FinalizedToken = "FinalizedToken",
  // MODULE:WALLET
  PayeeAdded = "PayeeAdded",
  PaymentReleased = "PaymentReleased",
  ERC20PaymentReleased = "ERC20PaymentReleased",
  PaymentReceived = "PaymentReceived",
  PaymentEthReceived = "PaymentEthReceived",
  PaymentEthSent = "PaymentEthSent",
}

export interface IWithdrawTokenEvent {
  token: string;
  amount: string;
}

export interface IFinalizedTokenEvent {
  token: string;
  amount: string;
}

export type IPyramidRuleStruct = [[IAssetStruct], [IAssetStruct], string, string, string, string, boolean];

export interface IPyramidCreateEvent {
  ruleId: string;
  rule: IPyramidRuleStruct;
  externalId: string;
}

export interface IPyramidUpdateEvent {
  ruleId: string;
  active: boolean;
}

// interface IPyramidRule {
//   deposit: IPyramidRuleItem;
//   reward: IPyramidRuleItem;
//   period: string;
//   maxCycles: string;
//   penalty: string;
//   externalId: string;
//   active: boolean;
// }

// interface IPyramidRuleItem {
//   itemType: PyramidItemType;
//   address: string;
//   tokenId: string;
//   amount: string;
// }

// enum PyramidItemType {
//   NATIVE = "0",
//   ERC20 = "1",
// }

export interface IPyramidDepositEvent {
  stakingId: string;
  ruleId: string;
  owner: string;
  startTimestamp: string;
  tokenId: string;
}

export interface IPyramidWithdrawEvent {
  stakingId: string;
  owner: string;
  withdrawTimestamp: string;
}

export interface IPyramidFinishEvent {
  stakingId: string;
  owner: string;
  withdrawTimestamp: string;
  multiplier: string;
}

// MODULE:WALLET
export interface IPyramidPayeeAddedEvent {
  account: string;
  shares: string;
  externalId: 0;
}

export interface IPyramidPaymentReceivedEvent {
  from: string;
  amount: string;
  externalId: 0;
}

export interface IPyramidPaymentReleasedEvent {
  to: string;
  amount: string;
  externalId: 0;
}

export interface IPyramidErc20PaymentReleasedEvent {
  token: string;
  to: string;
  amount: string;
  externalId: 0;
}

export type TPyramidEventData =
  | IPyramidCreateEvent
  | IPyramidUpdateEvent
  | IPyramidDepositEvent
  | IPyramidWithdrawEvent
  | IFinalizedTokenEvent
  | IWithdrawTokenEvent
  | IPyramidErc20PaymentReleasedEvent
  | IPyramidPaymentReleasedEvent
  | IPyramidPaymentReceivedEvent
  | IPyramidPayeeAddedEvent;
