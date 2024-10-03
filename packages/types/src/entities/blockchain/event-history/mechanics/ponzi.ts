import { IAssetItem } from "../exchange/common";

export enum PonziEventType {
  RuleCreatedP = "RuleCreatedP",
  RuleUpdated = "RuleUpdated",
  StakingStart = "StakingStart",
  StakingWithdraw = "StakingWithdraw",
  StakingFinish = "StakingFinish",
  WithdrawToken = "WithdrawToken",
  FinalizedToken = "FinalizedToken",
}

export enum PonziEventSignature {
  RuleCreatedP = "RuleCreatedP",
  RuleUpdated = "RuleUpdated",
  StakingStart = "StakingStart",
  StakingWithdraw = "StakingWithdraw",
  StakingFinish = "StakingFinish",
  WithdrawToken = "WithdrawToken",
  FinalizedToken = "FinalizedToken",
}

export interface IWithdrawTokenEvent {
  token: string;
  amount: string;
}

export interface IFinalizedTokenEvent {
  token: string;
  amount: string;
}

export interface IPonziRuleTermsStruct {
  period: string;
  maxCycles: string;
  penalty: string;
}

export interface IPonziRuleStruct {
  deposit: IAssetItem;
  reward: IAssetItem;
  terms: IPonziRuleTermsStruct;
  active: boolean;
}

export interface IPonziCreateEvent {
  ruleId: string;
  rule: IPonziRuleStruct;
}

export interface IPonziUpdateEvent {
  ruleId: string;
  active: boolean;
}

// interface IPonziRule {
//   deposit: IPonziRuleItem;
//   reward: IPonziRuleItem;
//   period: string;
//   maxCycles: string;
//   penalty: string;
//   externalId: string;
//   active: boolean;
// }

// interface IPonziRuleItem {
//   itemType: PonziItemType;
//   address: string;
//   tokenId: string;
//   amount: string;
// }

// enum PonziItemType {
//   NATIVE = "0",
//   ERC20 = "1",
// }

export interface IPonziDepositEvent {
  stakingId: string;
  ruleId: string;
  owner: string;
  startTimestamp: string;
  tokenId: string;
}

export interface IPonziWithdrawEvent {
  stakingId: string;
  owner: string;
  withdrawTimestamp: string;
}

export interface IPonziFinishEvent {
  stakingId: string;
  owner: string;
  withdrawTimestamp: string;
  multiplier: string;
}

// MODULE:WALLET
export interface IPonziPayeeAddedEvent {
  account: string;
  shares: string;
  externalId: 0;
}

export interface IPonziPaymentReceivedEvent {
  from: string;
  amount: string;
  externalId: 0;
}

export interface IPonziPaymentReleasedEvent {
  to: string;
  amount: string;
  externalId: 0;
}

export interface IPonziErc20PaymentReleasedEvent {
  token: string;
  to: string;
  amount: string;
  externalId: 0;
}

export type TPonziEvents =
  | IPonziCreateEvent
  | IPonziUpdateEvent
  | IPonziDepositEvent
  | IPonziWithdrawEvent
  | IFinalizedTokenEvent
  | IWithdrawTokenEvent
  | IPonziErc20PaymentReleasedEvent
  | IPonziPaymentReleasedEvent
  | IPonziPaymentReceivedEvent
  | IPonziPayeeAddedEvent;
