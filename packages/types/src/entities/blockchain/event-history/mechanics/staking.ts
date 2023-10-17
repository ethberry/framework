import type { IAssetItem } from "../exchange/common";

export enum StakingEventType {
  RuleCreated = "RuleCreated",
  RuleUpdated = "RuleUpdated",
  DepositStart = "DepositStart",
  DepositWithdraw = "DepositWithdraw",
  DepositFinish = "DepositFinish",
  BalanceWithdraw = "BalanceWithdraw",
  DepositReturn = "DepositReturn",
}

export interface IStakingRuleStruct {
  deposit: Array<IAssetItem>;
  reward: Array<IAssetItem>;
  content: Array<Array<IAssetItem>>;
  period: string;
  penalty: string;
  maxStake: string;
  recurrent: boolean;
  active: boolean;
}

export interface IStakingRuleCreateEvent {
  ruleId: string;
  rule: IStakingRuleStruct;
}

export interface IStakingRuleUpdateEvent {
  ruleId: string;
  active: boolean;
}

export interface IStakingRuleInterface {
  deposit: Array<IStakingRuleItem>;
  reward: Array<IStakingRuleItem>;
  period: string;
  penalty: string;
  recurrent: boolean;
  active: boolean;
}

export interface IStakingRuleItem {
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

export interface IStakingDepositStartEvent {
  stakingId: string;
  ruleId: string;
  owner: string;
  startTimestamp: string;
  tokenIds: Array<string>;
}

export interface IStakingDepositWithdrawEvent {
  stakingId: string;
  owner: string;
  withdrawTimestamp: string;
}

export interface IStakingBalanceWithdrawEvent {
  owner: string;
  item: IAssetItem;
}

export interface IStakingDepositFinishEvent {
  stakingId: string;
  owner: string;
  finishTimestamp: string;
  multiplier: string;
}

export interface IStakingDepositReturnEvent {
  stakingId: string;
  owner: string;
}

export type TStakingEvents =
  | IStakingRuleCreateEvent
  | IStakingRuleUpdateEvent
  | IStakingDepositStartEvent
  | IStakingDepositWithdrawEvent
  | IStakingDepositFinishEvent
  | IStakingBalanceWithdrawEvent
  | IStakingDepositReturnEvent;
