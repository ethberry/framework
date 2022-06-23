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
  rule: IStakingRuleSol;
  externalId: string;
}

export interface IStakingRuleUpdate {
  ruleId: string;
  active: boolean;
}

export interface IStakingRuleSol {
  deposit: IStakingRuleItemSol;
  reward: IStakingRuleItemSol;
  period: string;
  penalty: string;
  recurrent: boolean;
  active: boolean;
  externalId: string;
}

export interface IStakingRuleItemSol {
  itemType: StakingItemType;
  address: string;
  tokenId: string;
  amount: string;
}

export enum StakingItemType {
  NATIVE = "0",
  ERC20 = "1",
  ERC721 = "2",
  ERC998 = "3",
  ERC1155 = "4",
}

export interface IStakingRuleDeposit {
  stakingId: string;
  ruleId: string;
  owner: string;
  startTimestamp: string;
  tokenId: string;
}

export interface IStakingRuleWithdraw {
  stakingId: string;
  owner: string;
  withdrawTimestamp: string;
}

export interface IStakingRuleFinish {
  stakingId: string;
  owner: string;
  withdrawTimestamp: string;
  multiplier: string;
}

export type TStakingEventData = IStakingRuleCreate | IStakingRuleUpdate | IStakingRuleDeposit | IStakingRuleWithdraw;

export interface IStakingRuleHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: StakingEventType;
  eventData: TStakingEventData;
}
