import type { IIdDateBase } from "@gemunion/types-collection";

export enum ContractManagerEventType {
  VestingDeployed = "VestingDeployed",
  ERC20TokenDeployed = "ERC20TokenDeployed",
  ERC721TokenDeployed = "ERC721TokenDeployed",
  ERC998TokenDeployed = "ERC998TokenDeployed",
  ERC1155TokenDeployed = "ERC1155TokenDeployed",
  MysteryboxDeployed = "MysteryboxDeployed",
  PyramidDeployed = "PyramidDeployed",
  CollectionDeployed = "CollectionDeployed",
  StakingDeployed = "StakingDeployed",
}

export type IStakingDeployedEventArgs = [string, Array<string>];

export interface IContractManagerStakingDeployedEvent {
  addr: string;
  args: IStakingDeployedEventArgs;
  // maxStake: string;
  // featureIds: Array<number>;
}

export type ICollectionDeployedEventArgs = [string, string, string, string, Array<string>, string];

export interface IContractManagerCollectionDeployedEvent {
  addr: string;
  args: ICollectionDeployedEventArgs;
  // name: string;
  // symbol: string;
  // baseTokenURI: string;
  // royalty: string;
  // featureIds: Array<number>;
  // batchSize: number;
  owner: string;
}

export interface IContractManagerPyramidDeployedEvent {
  addr: string;
  featureIds: Array<number>;
}

export type IVestingDeployedEventArgs = [string, string, string, string, string];

export interface IContractManagerVestingDeployedEvent {
  addr: string;
  args: IVestingDeployedEventArgs;
  // account: string;
  // startTimestamp: string; // in seconds
  // duration: string; // in seconds
  // templateId: string;
}

export type IMysteryTokenDeployedEventArgs = [string, string, string, string, Array<string>];

export interface IContractManagerMysteryTokenDeployedEvent {
  addr: string;
  args: IMysteryTokenDeployedEventArgs;
  // name: string;
  // symbol: string;
  // baseTokenURI: string;
  // royalty: string;
  // featureIds: Array<number>;
}

export type IERC20TokenDeployedEventArgs = [string, string, string, Array<string>];

export interface IContractManagerERC20TokenDeployedEvent {
  addr: string;
  args: IERC20TokenDeployedEventArgs;
  // name: string;
  // symbol: string;
  // cap: string;
  // featureIds: Array<number>;
}

export type IERC721TokenDeployedEventArgs = [string, string, string, string, Array<string>];

export interface IContractManagerERC721TokenDeployedEvent {
  addr: string;
  args: IERC721TokenDeployedEventArgs;
  // name: string;
  // symbol: string;
  // baseTokenURI: string;
  // royalty: string;
  // featureIds: Array<number>;
}

export type IERC998TokenDeployedEventArgs = [string, string, string, string, Array<string>];

export interface IContractManagerERC998TokenDeployedEvent {
  addr: string;
  args: IERC998TokenDeployedEventArgs;
  // name: string;
  // symbol: string;
  // baseTokenURI: string;
  // royalty: string;
  // featureIds: Array<number>;
}

export type IERC1155TokenDeployedEventArgs = [string, Array<string>];

export interface IContractManagerERC1155TokenDeployedEvent {
  addr: string;
  args: IERC1155TokenDeployedEventArgs;
  // baseTokenURI: string;
  // featureIds: Array<number>;
}

export type TContractManagerEventData =
  | IContractManagerVestingDeployedEvent
  | IContractManagerERC20TokenDeployedEvent
  | IContractManagerERC721TokenDeployedEvent
  | IContractManagerERC998TokenDeployedEvent
  | IContractManagerERC1155TokenDeployedEvent
  | IContractManagerMysteryTokenDeployedEvent
  | IContractManagerPyramidDeployedEvent
  | IContractManagerCollectionDeployedEvent
  | IContractManagerStakingDeployedEvent;

export interface IContractManagerHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ContractManagerEventType;
  eventData: TContractManagerEventData;
}
