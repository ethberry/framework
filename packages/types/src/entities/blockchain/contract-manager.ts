import type { IIdDateBase } from "@gemunion/types-collection";

export enum ContractType {
  CONTRACT_MANAGER = "CONTRACT_MANAGER",
  CLAIM = "CLAIM",
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
  PYRAMID = "PYRAMID",
  WAITLIST = "WAITLIST",
  WRAPPER = "WRAPPER",
}

export interface IContractManager extends IIdDateBase {
  address: string;
  contractType: ContractType;
  fromBlock: number;
}
