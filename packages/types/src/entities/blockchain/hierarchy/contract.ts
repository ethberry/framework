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
  "SOULBOUND" = "SOULBOUND",
}

export enum Erc998ContractFeatures {
  "BLACKLIST" = "BLACKLIST",
  "UPGRADEABLE" = "UPGRADEABLE",
  "RANDOM" = "RANDOM",
  "ERC20" = "ERC20",
  "ERC1155" = "ERC1155",
}

export enum Erc1155ContractFeatures {
  "BLACKLIST" = "BLACKLIST",
}

export enum MysteryboxContractFeatures {
  "BLACKLIST" = "BLACKLIST",
  "PAUSABLE" = "PAUSABLE",
}

// waiting for https://github.com/microsoft/TypeScript/issues/17592
export enum ContractFeatures {
  "NATIVE" = "NATIVE",
  "EXTERNAL" = "EXTERNAL",
  "BLACKLIST" = "BLACKLIST",
  "UPGRADEABLE" = "UPGRADEABLE",
  "RANDOM" = "RANDOM",
  "SOULBOUND" = "SOULBOUND",
  // MODULE:MYSTERYBOX
  "PAUSABLE" = "PAUSABLE",
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
