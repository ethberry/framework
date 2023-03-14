export enum ContractManagerEventType {
  VestingDeployed = "VestingDeployed",
  ERC20TokenDeployed = "ERC20TokenDeployed",
  ERC721TokenDeployed = "ERC721TokenDeployed",
  ERC998TokenDeployed = "ERC998TokenDeployed",
  ERC1155TokenDeployed = "ERC1155TokenDeployed",
  MysteryboxDeployed = "MysteryboxDeployed",
  CollectionDeployed = "CollectionDeployed",
  PyramidDeployed = "PyramidDeployed",
  StakingDeployed = "StakingDeployed",
}

export type ICollectionDeployedEventArgs = [string, string, string, string, string, string];

export interface IContractManagerCollectionDeployedEvent {
  addr: string;
  args: ICollectionDeployedEventArgs;
  owner: string;
}

export type IVestingDeployedEventArgs = [string, string, string, string, string];

export interface IContractManagerVestingDeployedEvent {
  addr: string;
  args: IVestingDeployedEventArgs;
}

export type IMysteryTokenDeployedEventArgs = [string, string, string, string, string];

export interface IContractManagerMysteryTokenDeployedEvent {
  addr: string;
  args: IMysteryTokenDeployedEventArgs;
}

export type IERC20TokenDeployedEventArgs = [string, string, string, string];

export interface IContractManagerERC20TokenDeployedEvent {
  addr: string;
  args: IERC20TokenDeployedEventArgs;
}

export type IERC721TokenDeployedEventArgs = [string, string, string, string, string];

export interface IContractManagerERC721TokenDeployedEvent {
  addr: string;
  args: IERC721TokenDeployedEventArgs;
}

export type IERC998TokenDeployedEventArgs = [string, string, string, string, string];

export interface IContractManagerERC998TokenDeployedEvent {
  addr: string;
  args: IERC998TokenDeployedEventArgs;
}

export type IERC1155TokenDeployedEventArgs = [string, string];

export interface IContractManagerERC1155TokenDeployedEvent {
  addr: string;
  args: IERC1155TokenDeployedEventArgs;
}

export interface IContractManagerPyramidDeployedEvent {
  addr: string;
  featureIds: Array<number>;
}

export type IStakingDeployedEventArgs = [string, Array<string>];

export interface IContractManagerStakingDeployedEvent {
  addr: string;
  args: IStakingDeployedEventArgs;
}

export type TContractManagerEventData =
  | IContractManagerVestingDeployedEvent
  | IContractManagerERC20TokenDeployedEvent
  | IContractManagerERC721TokenDeployedEvent
  | IContractManagerERC998TokenDeployedEvent
  | IContractManagerERC1155TokenDeployedEvent
  | IContractManagerMysteryTokenDeployedEvent
  | IContractManagerCollectionDeployedEvent
  | IContractManagerStakingDeployedEvent
  | IContractManagerPyramidDeployedEvent;
