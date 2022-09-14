import type { IDeployable, ISearchable } from "@gemunion/types-collection";

import { IContractHistory } from "../contract-history";

import { ITemplate } from "./template";
import { ModuleType, TokenType } from "../common";
import { IComposition } from "./composition";

export enum ContractStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  NEW = "NEW",
}

export enum NativeContractFeatures {
  "NATIVE" = "NATIVE",
}

export enum Erc20ContractFeatures {
  "BLACKLIST" = "BLACKLIST",
  "EXTERNAL" = "EXTERNAL",
}

export enum Erc721ContractFeatures {
  "BLACKLIST" = "BLACKLIST",
  "UPGRADEABLE" = "UPGRADEABLE",
  "RANDOM" = "RANDOM",
  "GENES" = "GENES",
  "SOULBOUND" = "SOULBOUND",
}

export enum Erc998ContractFeatures {
  "BLACKLIST" = "BLACKLIST",
  "UPGRADEABLE" = "UPGRADEABLE",
  "RANDOM" = "RANDOM",
  "GENES" = "GENES",
  "ERC20OWNER" = "ERC20OWNER",
  "ERC1155OWNER" = "ERC1155OWNER",
}

export enum Erc1155ContractFeatures {
  "BLACKLIST" = "BLACKLIST",
}

export enum MysteryContractFeatures {
  "BLACKLIST" = "BLACKLIST",
  "PAUSABLE" = "PAUSABLE",
}

export enum PyramidContractFeatures {
  "LINEAR_REFERRAL" = "LINEAR_REFERRAL",
}

// waiting for https://github.com/microsoft/TypeScript/issues/17592
export enum ContractFeatures {
  "ALLOWANCE" = "ALLOWANCE",
  "NATIVE" = "NATIVE",
  "EXTERNAL" = "EXTERNAL",
  "BLACKLIST" = "BLACKLIST",
  "UPGRADEABLE" = "UPGRADEABLE",
  "RANDOM" = "RANDOM",
  "GENES" = "GENES",
  "SOULBOUND" = "SOULBOUND",
  // MODULE:MYSTERYBOX
  "PAUSABLE" = "PAUSABLE",
  // MODULE:ERC998
  "ERC20OWNER" = "ERC20OWNER",
  "ERC1155OWNER" = "ERC1155OWNER",
}

export interface IContract extends IDeployable, ISearchable {
  imageUrl: string;
  name: string;
  symbol: string;
  decimals: number;
  royalty: number;
  baseTokenURI: string;
  isPaused: boolean;
  fromBlock: number;
  contractStatus: ContractStatus;
  contractType: TokenType;
  contractFeatures: Array<ContractFeatures>;
  contractModule: ModuleType;
  templates: Array<ITemplate>;
  history?: Array<IContractHistory>;
  parent?: Array<IComposition>;
  children?: Array<IComposition>;
}
