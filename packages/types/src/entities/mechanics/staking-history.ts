import { IIdDateBase } from "@gemunion/types-collection";

export enum StakingEventType {
  RuleCreated = "RuleCreated",
  RuleUpdated = "RuleUpdated",
  StakingStart = "StakingStart",
  StakingWithdraw = "StakingWithdraw",
  StakingFinish = "StakingFinish",
}

export interface IStakingCreate {
  ruleId: string;
  rule: IStakingSol;
  externalId: string;
}

export interface IStakingUpdate {
  ruleId: string;
  active: boolean;
}

export interface IStakingSol {
  deposit: IStakingItemSol;
  reward: IStakingItemSol;
  period: string;
  penalty: string;
  recurrent: boolean;
  active: boolean;
  externalId: string;
}

export interface IStakingItemSol {
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

export interface IStakingDeposit {
  stakingId: string;
  ruleId: string;
  owner: string;
  startTimestamp: string;
  tokenId: string;
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

export type TStakingEventData = IStakingCreate | IStakingUpdate | IStakingDeposit | IStakingWithdraw;

export interface IStakingHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: StakingEventType;
  eventData: TStakingEventData;
}
