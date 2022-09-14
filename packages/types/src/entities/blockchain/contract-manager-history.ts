import type { IIdDateBase } from "@gemunion/types-collection";

export enum ContractManagerEventType {
  VestingDeployed = "VestingDeployed",
  ERC20TokenDeployed = "ERC20TokenDeployed",
  ERC721TokenDeployed = "ERC721TokenDeployed",
  ERC998TokenDeployed = "ERC998TokenDeployed",
  ERC1155TokenDeployed = "ERC1155TokenDeployed",
  MysteryboxDeployed = "MysteryboxDeployed",
  PyramidDeployed = "PyramidDeployed",
}

export interface IContractManagerPyramidDeployed {
  addr: string;
  featureIds: Array<number>;
}

export interface IContractManagerVestingDeployed {
  addr: string;
  account: string;
  startTimestamp: string; // in seconds
  duration: string; // in seconds
  templateId: string;
}

export interface IContractManagerERC20TokenDeployed {
  addr: string;
  name: string;
  symbol: string;
  cap: string;
  featureIds: Array<number>;
}

export interface IContractManagerERC721TokenDeployed {
  addr: string;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: string;
  featureIds: Array<number>;
}

export interface IContractManagerERC998TokenDeployed {
  addr: string;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: string;
  featureIds: Array<number>;
}

export interface IContractManagerMysteryboxDeployed {
  addr: string;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: string;
  featureIds: Array<number>;
}

export interface IContractManagerERC1155TokenDeployed {
  addr: string;
  baseTokenURI: string;
  featureIds: Array<number>;
}

export type TContractManagerEventData =
  | IContractManagerVestingDeployed
  | IContractManagerERC20TokenDeployed
  | IContractManagerERC721TokenDeployed
  | IContractManagerERC998TokenDeployed
  | IContractManagerERC1155TokenDeployed
  | IContractManagerMysteryboxDeployed
  | IContractManagerPyramidDeployed;

export interface IContractManagerHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ContractManagerEventType;
  eventData: TContractManagerEventData;
}
