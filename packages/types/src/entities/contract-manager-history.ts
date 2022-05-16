import { IIdBase } from "@gemunion/types-collection";

export enum ContractManagerEventType {
  ERC20VestingDeployed = "ERC20VestingDeployed",
  ERC20TokenDeployed = "ERC20TokenDeployed",
  ERC721TokenDeployed = "ERC721TokenDeployed",
  ERC1155TokenDeployed = "ERC1155TokenDeployed",
}

export interface IContractManagerERC20VestingDeployed {
  addr: string;
  beneficiary: string;
  startTimestamp: string; // in seconds
  duration: string; // in seconds
}

export interface IContractManagerERC20TokenDeployed {
  addr: string;
  name: string;
  symbol: string;
  cap: string;
}

export interface IContractManagerERC721TokenDeployed {
  addr: string;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: string;
}

export interface IContractManagerERC1155TokenDeployed {
  addr: string;
  baseTokenURI: string;
}

export type TContractManagerEventData =
  | IContractManagerERC20VestingDeployed
  | IContractManagerERC20TokenDeployed
  | IContractManagerERC721TokenDeployed
  | IContractManagerERC1155TokenDeployed;

export interface IContractManagerHistory extends IIdBase {
  address: string;
  transactionHash: string;
  eventType: ContractManagerEventType;
  eventData: TContractManagerEventData;
}
