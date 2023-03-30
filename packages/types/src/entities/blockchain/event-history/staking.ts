export enum StakingEventType {
  RuleCreated = "RuleCreated",
  RuleUpdated = "RuleUpdated",
  StakingStart = "StakingStart",
  StakingWithdraw = "StakingWithdraw",
  StakingFinish = "StakingFinish",
}

export type IAssetStruct = [string, string, string, string];

export type IStakingRuleStruct = [[IAssetStruct], [IAssetStruct], [IAssetStruct], string, string, boolean, boolean];

export interface IStakingCreateEvent {
  ruleId: string;
  rule: IStakingRuleStruct;
}

export interface IStakingUpdateEvent {
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

export interface IStakingDepositEvent {
  stakingId: string;
  ruleId: string;
  owner: string;
  startTimestamp: string;
  tokenIds: Array<string>;
}

export interface IStakingWithdrawEvent {
  stakingId: string;
  owner: string;
  withdrawTimestamp: string;
}

export interface IStakingFinishEvent {
  stakingId: string;
  owner: string;
  finishTimestamp: string;
  multiplier: string;
}

export type TStakingEvents =
  | IStakingCreateEvent
  | IStakingUpdateEvent
  | IStakingDepositEvent
  | IStakingWithdrawEvent
  | IStakingFinishEvent;
