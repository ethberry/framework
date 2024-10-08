import type { IAssetItem } from "../exchange/common";

export enum StakingEventType {
  RuleCreated = "RuleCreated",
  RuleUpdated = "RuleUpdated",
  DepositStart = "DepositStart",
  DepositWithdraw = "DepositWithdraw",
  DepositFinish = "DepositFinish",
  BalanceWithdraw = "BalanceWithdraw",
  DepositReturn = "DepositReturn",
  DepositPenalty = "DepositPenalty",
}

export enum StakingEventSignature {
  RuleCreated = "RuleCreated(uint256,((uint8,address,uint256,uint256)[],(uint8,address,uint256,uint256)[],(uint8,address,uint256,uint256)[][],(uint256,uint256,uint256,bool,bool),bool))",
  RuleUpdated = "RuleUpdated(uint256,bool)",
  DepositStart = "DepositStart(uint256,uint256,address,uint256,uint256[])",
  DepositWithdraw = "DepositWithdraw(uint256,address,uint256)",
  DepositFinish = "DepositFinish(uint256,address,uint256,uint256)",
  BalanceWithdraw = "BalanceWithdraw(address,(uint8,address,uint256,uint256))",
  DepositReturn = "DepositReturn(uint256,address)",
  DepositPenalty = "DepositPenalty(uint256,(uint8,address,uint256,uint256))",
}

export interface IStakingRuleTermsStruct {
  period: string;
  penalty: string;
  maxStake: string;
  recurrent: boolean;
  advance: boolean;
}

export interface IStakingRuleStruct {
  deposit: Array<IAssetItem>;
  reward: Array<IAssetItem>;
  content: Array<Array<IAssetItem>>;
  terms: IStakingRuleTermsStruct;
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

export interface IStakingPenaltyEvent {
  stakingId: string;
  item: IAssetItem;
}

export type TStakingEvents =
  | IStakingRuleCreateEvent
  | IStakingRuleUpdateEvent
  | IStakingDepositStartEvent
  | IStakingDepositWithdrawEvent
  | IStakingDepositFinishEvent
  | IStakingBalanceWithdrawEvent
  | IStakingDepositReturnEvent
  | IStakingPenaltyEvent;
