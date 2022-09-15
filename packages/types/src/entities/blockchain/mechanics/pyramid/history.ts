import type { IIdDateBase } from "@gemunion/types-collection";

export enum PyramidEventType {
  RuleCreated = "RuleCreated",
  RuleUpdated = "RuleUpdated",
  StakingStart = "StakingStart",
  StakingWithdraw = "StakingWithdraw",
  StakingFinish = "StakingFinish",
  WithdrawToken = "WithdrawToken",
  FinalizedToken = "FinalizedToken",
}

export interface IWithdrawToken {
  token: string;
  amount: string;
}

export interface IFinalizedToken {
  token: string;
  amount: string;
}

export interface IPyramidCreateEvent {
  ruleId: string;
  rule: IPyramidRule;
  externalId: string;
}

export interface IPyramidUpdateEvent {
  ruleId: string;
  active: boolean;
}

interface IPyramidRule {
  deposit: IPyramidRuleItem;
  reward: IPyramidRuleItem;
  period: string;
  penalty: string;
  recurrent: boolean;
  active: boolean;
  externalId: string;
}

interface IPyramidRuleItem {
  itemType: PyramidItemType;
  address: string;
  tokenId: string;
  amount: string;
}

enum PyramidItemType {
  NATIVE = "0",
  ERC20 = "1",
}

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

export type TPyramidEventData =
  | IPyramidCreateEvent
  | IPyramidUpdateEvent
  | IPyramidDepositEvent
  | IPyramidWithdrawEvent
  | IFinalizedToken;

export interface IPyramidHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: PyramidEventType;
  eventData: TPyramidEventData;
}
