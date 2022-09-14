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

export interface IPyramidCreate {
  ruleId: string;
  rule: IPyramidSol;
  externalId: string;
}

export interface IPyramidUpdate {
  ruleId: string;
  active: boolean;
}

export interface IPyramidSol {
  deposit: IPyramidItemSol;
  reward: IPyramidItemSol;
  period: string;
  penalty: string;
  recurrent: boolean;
  active: boolean;
  externalId: string;
}

export interface IPyramidItemSol {
  itemType: PyramidItemType;
  address: string;
  tokenId: string;
  amount: string;
}

export enum PyramidItemType {
  NATIVE = "0",
  ERC20 = "1",
}

export interface IPyramidDeposit {
  stakingId: string;
  ruleId: string;
  owner: string;
  startTimestamp: string;
  tokenId: string;
}

export interface IPyramidWithdraw {
  stakingId: string;
  owner: string;
  withdrawTimestamp: string;
}

export interface IPyramidFinish {
  stakingId: string;
  owner: string;
  withdrawTimestamp: string;
  multiplier: string;
}

export type TPyramidEventData = IPyramidCreate | IPyramidUpdate | IPyramidDeposit | IPyramidWithdraw | IFinalizedToken;

export interface IPyramidHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: PyramidEventType;
  eventData: TPyramidEventData;
}
