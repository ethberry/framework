export enum StakingEventType {
  RuleCreated = "RuleCreated",
  RuleUpdated = "RuleUpdated",
  StakingStart = "StakingStart",
  StakingWithdraw = "StakingWithdraw",
  StakingFinish = "StakingFinish",
}

export interface IStakingCreateEvent {
  ruleId: string;
  rule: IStakingRule;
  externalId: string;
}

export interface IStakingUpdateEvent {
  ruleId: string;
  active: boolean;
}

interface IStakingRule {
  deposit: Array<IStakingRuleItem>;
  reward: Array<IStakingRuleItem>;
  period: string;
  penalty: string;
  recurrent: boolean;
  active: boolean;
  externalId: string;
}

interface IStakingRuleItem {
  itemType: StakingItemType;
  address: string;
  tokenId: string;
  amount: string;
}

enum StakingItemType {
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
  tokenId: string;
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
