import type { ISearchable } from "@gemunion/types-collection";
import type { IDeployable, TokenType } from "@gemunion/types-blockchain";

import type { IEventHistory } from "../event-history";

import type { ITemplate } from "./template";
import type { IComposition } from "./composition";
import { ModuleType } from "../../common";

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
}

export enum Erc20ContractTemplates {
  "SIMPLE" = "SIMPLE",
  "BLACKLIST" = "BLACKLIST",
  "WHITELIST" = "WHITELIST",
  "EXTERNAL" = "EXTERNAL",
}

export enum Erc721ContractFeatures {
  "BLACKLIST" = "BLACKLIST",
  "UPGRADEABLE" = "UPGRADEABLE",
  "RENTABLE" = "RENTABLE",
  "RANDOM" = "RANDOM",
  "GENES" = "GENES",
  "SOULBOUND" = "SOULBOUND",
}

export enum Erc721ContractTemplates {
  "SIMPLE" = "SIMPLE",
  "BLACKLIST" = "BLACKLIST",
  "BLACKLIST_RANDOM" = "BLACKLIST_RANDOM",
  "BLACKLIST_UPGRADEABLE" = "BLACKLIST_UPGRADEABLE",
  "BLACKLIST_UPGRADEABLE_RANDOM" = "BLACKLIST_UPGRADEABLE_RANDOM",
  "BLACKLIST_UPGRADEABLE_RENTABLE" = "BLACKLIST_UPGRADEABLE_RENTABLE",
  "BLACKLIST_UPGRADEABLE_RENTABLE_RANDOM" = "BLACKLIST_UPGRADEABLE_RENTABLE_RANDOM",
  "GENES" = "GENES",
  "RANDOM" = "RANDOM",
  "SOULBOUND" = "SOULBOUND",
  "SOULBOUND_VOTES" = "SOULBOUND_VOTES",
  "UPGRADEABLE" = "UPGRADEABLE",
  "UPGRADEABLE_RANDOM" = "UPGRADEABLE_RANDOM",
}

export enum Erc998ContractFeatures {
  "BLACKLIST" = "BLACKLIST",
  "UPGRADEABLE" = "UPGRADEABLE",
  "RANDOM" = "RANDOM",
  "GENES" = "GENES",
  "ERC20OWNER" = "ERC20OWNER",
  "ERC1155OWNER" = "ERC1155OWNER",
  "STATEHASH" = "STATEHASH",
}

export enum Erc998ContractTemplates {
  "SIMPLE" = "SIMPLE",
  "BLACKLIST" = "BLACKLIST",
  "BLACKLIST_RANDOM" = "BLACKLIST_RANDOM",
  "BLACKLIST_UPGRADEABLE" = "BLACKLIST_UPGRADEABLE",
  "BLACKLIST_UPGRADEABLE_RANDOM" = "BLACKLIST_UPGRADEABLE_RANDOM",
  "ERC20OWNER" = "ERC20OWNER",
  "ERC1155OWNER" = "ERC1155OWNER",
  "ERC1155OWNER_ERC20OWNER" = "ERC20OWNER",
  "GENES" = "GENES",
  "RANDOM" = "RANDOM",
  "STATEHASH" = "STATEHASH",
  "UPGRADEABLE" = "UPGRADEABLE",
  "UPGRADEABLE_RANDOM" = "UPGRADEABLE_RANDOM",
}

export enum Erc1155ContractFeatures {
  "BLACKLIST" = "BLACKLIST",
  "SOULBOUND" = "SOULBOUND",
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

export enum Erc721CollectionFeatures {
  "BLACKLIST" = "BLACKLIST",
}

export enum Erc721CollectionTemplates {
  "SIMPLE" = "SIMPLE",
  "BLACKLIST" = "BLACKLIST",
}

export enum PyramidContractFeatures {
  "REFERRAL" = "REFERRAL",
  "SPLITTER" = "SPLITTER",
}

export enum PyramidContractTemplates {
  "SIMPLE" = "SIMPLE",
  "REFERRAL" = "REFERRAL",
  "SPLITTER" = "SPLITTER",
}

export enum StakingContractFeatures {
  "REFERRAL" = "REFERRAL",
}

export enum StakingContractTemplates {
  "SIMPLE" = "SIMPLE",
  "REFERRAL" = "REFERRAL",
}

// waiting for https://github.com/microsoft/TypeScript/issues/17592
export enum ContractTemplates {
  "SIMPLE" = "SIMPLE",
  "BLACKLIST" = "BLACKLIST",
  "WHITELIST" = "WHITELIST",
  "EXTERNAL" = "EXTERNAL",

  "GENES" = "GENES",
  "RANDOM" = "RANDOM",
  "BLACKLIST_RANDOM" = "BLACKLIST_RANDOM",
  "BLACKLIST_UPGRADEABLE" = "BLACKLIST_UPGRADEABLE",
  "BLACKLIST_UPGRADEABLE_RANDOM" = "BLACKLIST_UPGRADEABLE_RANDOM",
  "SOULBOUND" = "SOULBOUND",
  "SOULBOUND_VOTES" = "SOULBOUND_VOTES",
  "UPGRADEABLE" = "UPGRADEABLE",
  "UPGRADEABLE_RANDOM" = "UPGRADEABLE_RANDOM",

  "ERC20OWNER" = "ERC20OWNER",
  "ERC1155OWNER" = "ERC1155OWNER",
  "ERC1155OWNER_ERC20OWNER" = "ERC20OWNER",
  "STATE_HASH" = "STATE_HASH",

  "BLACKLIST_PAUSABLE" = "BLACKLIST_PAUSABLE",
  "PAUSABLE" = "PAUSABLE",

  "REFERRAL" = "REFERRAL",
  "SPLITTER" = "SPLITTER",
}

export enum ContractFeatures {
  "WITHDRAW" = "WITHDRAW",
  "ALLOWANCE" = "ALLOWANCE",
  "EXTERNAL" = "EXTERNAL",
  "BLACKLIST" = "BLACKLIST",
  "WHITELIST" = "WHITELIST",
  "SOULBOUND" = "SOULBOUND",
  "UPGRADEABLE" = "UPGRADEABLE",
  "GENES" = "GENES",
  "PAUSABLE" = "PAUSABLE",
  "RENTABLE" = "RENTABLE",
  "RANDOM" = "RANDOM",
  // MODULE:VESTING
  "LINEAR" = "LINEAR", // 0 -> 25 -> 50 -> 75 -> 100
  "GRADED" = "GRADED", // 0 -> 10 -> 30 -> 60 -> 100
  "CLIFF" = "CLIFF", // 0 -> 100
}

export interface IContract extends IDeployable, ISearchable {
  merchantId: number;
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
  contractType: TokenType;
  contractFeatures: Array<ContractFeatures>;
  contractModule: ModuleType;
  templates: Array<ITemplate>;
  history?: Array<IEventHistory>;
  parent?: Array<IComposition>;
  children?: Array<IComposition>;
}
