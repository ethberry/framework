import type { IIdDateBase } from "@gemunion/types-collection";

export enum ContractManagerEventType {
  VestingDeployed = "VestingDeployed",
  ERC20TokenDeployed = "ERC20TokenDeployed",
  ERC721TokenDeployed = "ERC721TokenDeployed",
  ERC998TokenDeployed = "ERC998TokenDeployed",
  ERC1155TokenDeployed = "ERC1155TokenDeployed",
  MysteryboxDeployed = "MysteryboxDeployed",
  PyramidDeployed = "PyramidDeployed",
  ERC721CollectionDeployed = "ERC721CollectionDeployed",
  StakingDeployed = "StakingDeployed",
}

export interface IContractManagerStakingDeployedEvent {
  addr: string;
  maxStake: string;
  featureIds: Array<number>;
}

export interface IContractManagerErc721CollectionDeployedEvent {
  addr: string;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: string;
  featureIds: Array<number>;
  batchSize: number;
  owner: string;
}

export interface IContractManagerPyramidDeployedEvent {
  addr: string;
  featureIds: Array<number>;
}

export interface IContractManagerVestingDeployedEvent {
  addr: string;
  account: string;
  startTimestamp: string; // in seconds
  duration: string; // in seconds
  templateId: string;
}

export interface IContractManagerERC20TokenDeployedEvent {
  addr: string;
  name: string;
  symbol: string;
  cap: string;
  featureIds: Array<number>;
}

export interface IContractManagerERC721TokenDeployedEvent {
  addr: string;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: string;
  featureIds: Array<number>;
}

export interface IContractManagerERC998TokenDeployedEvent {
  addr: string;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: string;
  featureIds: Array<number>;
}

export interface IContractManagerMysteryTokenDeployedEvent {
  addr: string;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: string;
  featureIds: Array<number>;
}

export interface IContractManagerERC1155TokenDeployedEvent {
  addr: string;
  baseTokenURI: string;
  featureIds: Array<number>;
}

export type TContractManagerEventData =
  | IContractManagerVestingDeployedEvent
  | IContractManagerERC20TokenDeployedEvent
  | IContractManagerERC721TokenDeployedEvent
  | IContractManagerERC998TokenDeployedEvent
  | IContractManagerERC1155TokenDeployedEvent
  | IContractManagerMysteryTokenDeployedEvent
  | IContractManagerPyramidDeployedEvent
  | IContractManagerErc721CollectionDeployedEvent
  | IContractManagerStakingDeployedEvent;

export interface IContractManagerHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ContractManagerEventType;
  eventData: TContractManagerEventData;
}
