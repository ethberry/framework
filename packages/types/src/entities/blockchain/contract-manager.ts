import { IIdDateBase } from "@gemunion/types-collection";

export enum ContractType {
  CONTRACT_MANAGER = "CONTRACT_MANAGER",
  ERC721_MARKETPLACE = "ERC721_MARKETPLACE",
  ERC721_TOKEN = "ERC721_TOKEN",
  ERC721_AIRDROP = "ERC721_AIRDROP",
  ERC721_DROPBOX = "ERC721_DROPBOX",
  ERC721_CRAFT = "ERC721_CRAFT",
  ERC998_MARKETPLACE = "ERC998_MARKETPLACE",
  ERC998_TOKEN = "ERC998_TOKEN",
  ERC998_AIRDROP = "ERC998_AIRDROP",
  ERC998_DROPBOX = "ERC998_DROPBOX",
  ERC998_CRAFT = "ERC998_CRAFT",
  ERC1155_MARKETPLACE = "ERC1155_MARKETPLACE",
  ERC1155_TOKEN = "ERC1155_TOKEN",
  ERC1155_CRAFT = "ERC1155_CRAFT",
  ERC20_TOKEN = "ERC20_TOKEN",
  VESTING = "VESTING",
  ERC20_STAKING = "ERC20_STAKING",
  STAKING = "STAKING",
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
