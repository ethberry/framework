import type { IIdDateBase } from "@ethberry/types-collection";

export enum ContractType {
  CONTRACT_MANAGER = "CONTRACT_MANAGER",
  CLAIM = "CLAIM",
  LOOT = "LOOT",
  MYSTERY = "MYSTERY",
  EXCHANGE = "EXCHANGE",
  STAKING = "STAKING",
  VESTING = "VESTING",
  ERC20_TOKEN = "ERC20_TOKEN",
  ERC721_TOKEN = "ERC721_TOKEN",
  ERC721_TOKEN_RANDOM = "ERC721_TOKEN_RANDOM",
  ERC998_TOKEN = "ERC998_TOKEN",
  ERC998_TOKEN_RANDOM = "ERC998_TOKEN_RANDOM",
  ERC1155_TOKEN = "ERC1155_TOKEN",
  METADATA = "METADATA",
  LOTTERY = "LOTTERY",
  RAFFLE = "RAFFLE",
  PONZI = "PONZI",
  WAIT_LIST = "WAIT_LIST",
  PAYMENT_SPLITTER = "PAYMENT_SPLITTER",
  WRAPPER = "WRAPPER",
  PREDICTION = "PREDICTION",
  VRF = "VRF",
}

export interface IContractManager extends IIdDateBase {
  address: string;
  contractType: ContractType;
  fromBlock: number;
}
