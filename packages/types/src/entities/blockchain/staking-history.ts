import { IIdDateBase } from "@gemunion/types-collection";

export enum StakingEventType {
  RuleCreated = "RuleCreated",
  RuleUpdated = "RuleUpdated",
  StakingStart = "StakingStart",
  StakingWithdraw = "StakingWithdraw",
  StakingFinish = "StakingFinish",
}

export interface IStakingRuleCreate {
  ruleId: string;
  rule: IStakingRule;
}

export interface IStakingRuleUpdate {
  ruleId: string;
  active: boolean;
}

export interface IStakingRule {
  deposit: IStakingItemSol;
  reward: IStakingItemSol;
  period: string;
  penalty: string;
  recurrent: boolean;
  active: boolean;
}

export interface IStakingItemSol {
  itemType: StakingItemType;
  address: string;
  tokenData: IStakingTokenData;
  amount: string;
}

export interface IStakingTokenData {
  tokenId: string;
  templateId: string;
}

export enum StakingItemType {
  NATIVE = "0",
  ERC20 = "1",
  ERC721 = "2",
  ERC1155 = "3",
}

export interface IStakingDeposit {
  stakingId: string;
  owner: string;
  startTimestamp: string;
  finishTimestamp: string;
  amount: string;
  period: string;
}

export interface IStakingWithdraw {
  stakingId: string;
  owner: string;
  withdrawTimestamp: string;
}

export interface IStakingFinish {
  stakingId: string;
  owner: string;
  withdrawTimestamp: string;
  multiplier: string;
}

export type TStakingEventData = IStakingRuleCreate | IStakingRuleUpdate | IStakingDeposit | IStakingWithdraw;

export interface IStakingHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: StakingEventType;
  eventData: TStakingEventData;
}
