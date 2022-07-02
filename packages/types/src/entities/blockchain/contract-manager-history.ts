import { IIdDateBase } from "@gemunion/types-collection";

export enum ContractManagerEventType {
  ERC20VestingDeployed = "ERC20VestingDeployed",
  ERC20TokenDeployed = "ERC20TokenDeployed",
  ERC721TokenDeployed = "ERC721TokenDeployed",
  ERC1155TokenDeployed = "ERC1155TokenDeployed",
}

export interface IContractManagerVestingDeployed {
  addr: string;
  beneficiary: string;
  startTimestamp: string; // in seconds
  duration: string; // in seconds
  templateId: string;
}

export interface IContractManagerERC20TokenDeployed {
  addr: string;
  name: string;
  symbol: string;
  cap: string;
  templateId: string;
}

export interface IContractManagerERC721TokenDeployed {
  addr: string;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: string;
  templateId: string;
}

export interface IContractManagerERC1155TokenDeployed {
  addr: string;
  baseTokenURI: string;
  templateId: string;
}

export type TContractManagerEventData =
  | IContractManagerVestingDeployed
  | IContractManagerERC20TokenDeployed
  | IContractManagerERC721TokenDeployed
  | IContractManagerERC1155TokenDeployed;

export interface IContractManagerHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ContractManagerEventType;
  eventData: TContractManagerEventData;
}
