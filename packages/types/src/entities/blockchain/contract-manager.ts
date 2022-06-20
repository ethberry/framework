import { IIdDateBase } from "@gemunion/types-collection";

export enum ContractType {
  CONTRACT_MANAGER = "CONTRACT_MANAGER",
  ERC721_MARKETPLACE = "ERC721_MARKETPLACE",
  ERC721_TOKEN = "ERC721_TOKEN",
  ERC721_AIRDROP = "ERC721_AIRDROP",
  ERC721_DROPBOX = "ERC721_DROPBOX",
  ERC721_CRAFT = "ERC721_CRAFT",
  ERC1155_MARKETPLACE = "ERC1155_MARKETPLACE",
  ERC1155_TOKEN = "ERC1155_TOKEN",
  ERC1155_CRAFT = "ERC1155_CRAFT",
  ERC20_TOKEN = "ERC20_TOKEN",
  ERC20_VESTING = "ERC20_VESTING",
  ERC20_STAKING = "ERC20_STAKING",
  STAKING = "STAKING",
  SEAPORT = "SEAPORT",
}

export enum ContractTemplateType {
  contractManager = "contractManager",
  erc20Simple = "erc20simple",
  erc20Bl = "erc20Bl",
  erc20VestingLinear = "erc20VestingLinear",
  erc20VestingGraded = "erc20VestingGraded",
  erc20VestingCliff = "erc20VestingCliff",
  erc721Simple = "erc721Simple",
  erc721Graded = "erc721Graded",
  erc721Random = "erc721Random",
  erc721Dropbox = "erc721Dropbox",
  erc721Airdrop = "erc721Airdrop",
  erc721Marketplace = "erc721Marketplace",
  erc721Craft = "erc721Craft",
  erc1155Simple = "erc1155Simple",
  erc1155Craft = "erc1155Craft",
  erc1155Marketplace = "erc1155Marketplace",
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
