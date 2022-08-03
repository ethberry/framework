import { IIdDateBase } from "@gemunion/types-collection";

export enum ContractType {
  CONTRACT_MANAGER = "CONTRACT_MANAGER",
  CLAIM = "CLAIM",
  MYSTERYBOX = "MYSTERYBOX",
  EXCHANGE = "EXCHANGE",
  STAKING = "STAKING",
  VESTING = "VESTING",
  ERC20_TOKEN = "ERC20_TOKEN",
  ERC721_TOKEN = "ERC721_TOKEN",
  ERC998_TOKEN = "ERC998_TOKEN",
  ERC1155_TOKEN = "ERC1155_TOKEN",
  METADATA = "METADATA",
}

export interface IContractManagerUpdateDto {
  address: string;
  contractType: ContractType;
  lastBlock: number; // last log block
}

export interface IContractManager extends IIdDateBase {
  address: string;
  contractType: ContractType;
  fromBlock: number;
}
