import { IIdDateBase } from "@gemunion/types-collection";

export enum ContractType {
  CONTRACT_MANAGER = "CONTRACT_MANAGER",
  AIRDROP = "AIRDROP",
  DROPBOX = "DROPBOX",
  ERC1155_CRAFT = "ERC1155_CRAFT",
  ERC1155_TOKEN = "ERC1155_TOKEN",
  ERC20_TOKEN = "ERC20_TOKEN",
  ERC721_CRAFT = "ERC721_CRAFT",
  ERC721_TOKEN = "ERC721_TOKEN",
  ERC998_CRAFT = "ERC998_CRAFT",
  ERC998_TOKEN = "ERC998_TOKEN",
  MARKETPLACE = "MARKETPLACE",
  STAKING = "STAKING",
  VESTING = "VESTING",
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
