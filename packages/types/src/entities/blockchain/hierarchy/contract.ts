import type { ISearchable } from "@gemunion/types-collection";
import type { IDeployable, TokenType } from "@gemunion/types-blockchain";

import type { IEventHistory } from "../event-history";

import type { ITemplate } from "./template";
import type { IComposition } from "./composition";
import { ModuleType } from "../../common";
import type { IRent } from "../mechanics/rent/rent";
import type { IMerchant } from "../../infrastructure";

export enum ContractStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  NEW = "NEW",
}

export enum NativeContractFeatures {}

export enum NativeContractTemplates {
  "SIMPLE" = "SIMPLE",
}

export enum Erc20ContractFeatures {
  "BLACKLIST" = "BLACKLIST",
  "WHITELIST" = "WHITELIST",
  "EXTERNAL" = "EXTERNAL",
  "STABLE_COIN" = "STABLE_COIN",
}

export enum Erc20ContractTemplates {
  "SIMPLE" = "SIMPLE",
  "BLACKLIST" = "BLACKLIST",
  "WHITELIST" = "WHITELIST",
  "EXTERNAL" = "EXTERNAL",
}

export enum Erc721ContractFeatures {
  "BLACKLIST" = "BLACKLIST",
  "DISCRETE" = "DISCRETE",
  "RENTABLE" = "RENTABLE",
  "RANDOM" = "RANDOM",
  "GENES" = "GENES",
  "SOULBOUND" = "SOULBOUND",
  "VOTES" = "VOTES",
  "EXTERNAL" = "EXTERNAL",
}

export enum Erc721ContractTemplates {
  "SIMPLE" = "SIMPLE",
  "BLACKLIST" = "BLACKLIST",
  "BLACKLIST_RANDOM" = "BLACKLIST_RANDOM",
  "BLACKLIST_DISCRETE" = "BLACKLIST_DISCRETE",
  "BLACKLIST_DISCRETE_RANDOM" = "BLACKLIST_DISCRETE_RANDOM",
  "BLACKLIST_DISCRETE_RENTABLE" = "BLACKLIST_DISCRETE_RENTABLE",
  "BLACKLIST_DISCRETE_RENTABLE_RANDOM" = "BLACKLIST_DISCRETE_RENTABLE_RANDOM",
  "GENES" = "GENES",
  "RANDOM" = "RANDOM",
  "RENTABLE" = "RENTABLE",
  "SOULBOUND" = "SOULBOUND",
  "SOULBOUND_VOTES" = "SOULBOUND_VOTES",
  "DISCRETE" = "DISCRETE",
  "DISCRETE_RANDOM" = "DISCRETE_RANDOM",
  "LOTTERY" = "LOTTERY",
  "RAFFLE" = "RAFFLE",
}

export enum Erc998ContractFeatures {
  "BLACKLIST" = "BLACKLIST",
  "DISCRETE" = "DISCRETE",
  "RANDOM" = "RANDOM",
  "RENTABLE" = "RENTABLE",
  "GENES" = "GENES",
  "ERC20OWNER" = "ERC20OWNER",
  "ERC1155OWNER" = "ERC1155OWNER",
  "STATEHASH" = "STATEHASH",
}

export enum Erc998ContractTemplates {
  "SIMPLE" = "SIMPLE",
  "BLACKLIST" = "BLACKLIST",
  "BLACKLIST_RANDOM" = "BLACKLIST_RANDOM",
  "BLACKLIST_DISCRETE" = "BLACKLIST_DISCRETE",
  "BLACKLIST_DISCRETE_RANDOM" = "BLACKLIST_DISCRETE_RANDOM",
  "ERC20OWNER" = "ERC20OWNER",
  "ERC1155OWNER" = "ERC1155OWNER",
  "ERC1155OWNER_ERC20OWNER" = "ERC1155OWNER_ERC20OWNER",
  "GENES" = "GENES",
  "RANDOM" = "RANDOM",
  "RENTABLE" = "RENTABLE",
  "STATEHASH" = "STATEHASH",
  "DISCRETE" = "DISCRETE",
  "DISCRETE_RANDOM" = "DISCRETE_RANDOM",
}

export enum Erc1155ContractFeatures {
  "BLACKLIST" = "BLACKLIST",
  "SOULBOUND" = "SOULBOUND",
  "EXTERNAL" = "EXTERNAL",
}

export enum Erc1155ContractTemplates {
  "SIMPLE" = "SIMPLE",
  "BLACKLIST" = "BLACKLIST",
  "SOULBOUND" = "SOULBOUND",
}

export enum MysteryContractFeatures {
  "BLACKLIST" = "BLACKLIST",
  "PAUSABLE" = "PAUSABLE",
}

export enum MysteryContractTemplates {
  "SIMPLE" = "SIMPLE",
  "BLACKLIST_PAUSABLE" = "BLACKLIST_PAUSABLE",
  "PAUSABLE" = "PAUSABLE",
  "BLACKLIST" = "BLACKLIST",
}

export enum CollectionContractFeatures {
  "BLACKLIST" = "BLACKLIST",
}

export enum CollectionContractTemplates {
  "SIMPLE" = "SIMPLE",
  "BLACKLIST" = "BLACKLIST",
}

export enum PonziContractFeatures {
  "REFERRAL" = "REFERRAL",
  "SPLITTER" = "SPLITTER",
}

export enum PonziContractTemplates {
  "SIMPLE" = "SIMPLE",
  "REFERRAL" = "REFERRAL",
  "SPLITTER" = "SPLITTER",
}

export enum StakingContractFeatures {}

export enum StakingContractTemplates {
  "SIMPLE" = "SIMPLE",
}

export enum ContractFeatures {
  // SYSTEM
  "WITHDRAW" = "WITHDRAW",
  "ALLOWANCE" = "ALLOWANCE",
  "EXTERNAL" = "EXTERNAL",

  // ERC20
  "BLACKLIST" = "BLACKLIST",
  "WHITELIST" = "WHITELIST",
  "STABLE_COIN" = "STABLE_COIN",

  // EC721
  "DISCRETE" = "DISCRETE",
  "GENES" = "GENES",
  "RANDOM" = "RANDOM",
  "RENTABLE" = "RENTABLE",
  "SOULBOUND" = "SOULBOUND",
  "VOTES" = "VOTES",
  "TRAITS" = "TRAITS",

  // ERC998
  "ERC20OWNER" = "ERC20OWNER",
  "ERC1155OWNER" = "ERC1155OWNER",
  "STATEHASH" = "STATEHASH",

  // MODULE:MYSTERY
  "PAUSABLE" = "PAUSABLE",

  // MODULE:PONZI
  "REFERRAL" = "REFERRAL",
  "SPLITTER" = "SPLITTER",
}

export enum ContractSecurity {
  "OWNABLE" = "OWNABLE",
  "OWNABLE_2_STEP" = "OWNABLE_2_STEP",
  "ACCESS_CONTROL" = "ACCESS_CONTROL",
  "ACCESS_CONTROL_ENUMERABLE" = "ACCESS_CONTROL_ENUMERABLE",
  "ACCESS_CONTROL_DEFAULT_ADMIN_RULES" = "ACCESS_CONTROL_DEFAULT_ADMIN_RULES",
  "ACCESS_CONTROL_CROSS_CHAIN" = "ACCESS_CONTROL_CROSS_CHAIN",
}

export interface IContract extends IDeployable, ISearchable {
  imageUrl: string;
  name: string;
  symbol: string;
  decimals: number;
  royalty: number;
  baseTokenURI: string;
  parameters: Record<string, string | number>;
  isPaused: boolean;
  fromBlock: number;
  contractStatus: ContractStatus;
  contractType: TokenType | null;
  contractFeatures: Array<ContractFeatures>;
  contractModule: ModuleType;
  contractSecurity: ContractSecurity;
  templates: Array<ITemplate>;
  history?: Array<IEventHistory>;
  parent?: Array<IComposition>;
  children?: Array<IComposition>;
  rent?: Array<IRent>;
  merchantId: number;
  merchant?: IMerchant;
}
