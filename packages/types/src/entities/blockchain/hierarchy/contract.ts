import { IDeployable, ISearchable } from "@gemunion/types-collection";

import { IContractHistory } from "../contract-history";

import { ITemplate } from "./template";
import { ModuleType, TokenType } from "../common";

export enum ContractStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  NEW = "NEW",
}

export enum Erc20ContractTemplate {
  "SIMPLE" = "SIMPLE", // ACBCS
  "BLACKLIST" = "BLACKLIST", // ACBCS + BLACKLIST
  "EXTERNAL" = "EXTERNAL", // any 3rd party token
  "NATIVE" = "NATIVE", // ETH
}

export enum Erc721ContractTemplate {
  "SIMPLE" = "SIMPLE", // ACBER
  "BLACKLIST" = "BLACKLIST", // ACBER + BLACKLIST
  "UPGRADEABLE" = "UPGRADEABLE", // ACBER + METADATA
  "RANDOM" = "RANDOM", // ACBER + METADATA + CHAINLINK
  // MODULE:LOOTBOX
  "LOOTBOX" = "LOOTBOX", // ACBER + METADATA + Unpack
}

export enum Erc998ContractTemplate {
  "SIMPLE" = "SIMPLE", // ACBER
  "BLACKLIST" = "BLACKLIST", // ACBER + BLACKLIST
  "UPGRADEABLE" = "UPGRADEABLE", // ACBER + METADATA
  "RANDOM" = "RANDOM", // ACBER + METADATA + CHAINLINK
}

export enum Erc1155ContractTemplate {
  "SIMPLE" = "SIMPLE", // ACBS
  "BLACKLIST" = "BLACKLIST", // ACBS + BLACKLIST
}

// waiting for https://github.com/microsoft/TypeScript/issues/17592
export enum ContractTemplate {
  "UNKNOWN" = "UNKNOWN",
  "SIMPLE" = "SIMPLE",
  "BLACKLIST" = "BLACKLIST",
  "EXTERNAL" = "EXTERNAL",
  "NATIVE" = "NATIVE",
  "UPGRADEABLE" = "UPGRADEABLE",
  "RANDOM" = "RANDOM",
  // MODULE:LOOTBOX
  "LOOTBOX" = "LOOTBOX", // ACBER + METADATA + Unpack
}

export interface IContract extends IDeployable, ISearchable {
  imageUrl: string;
  name: string;
  symbol: string;
  decimals: number;
  royalty: number;
  baseTokenURI: string;
  contractStatus: ContractStatus;
  contractType: TokenType;
  contractTemplate: ContractTemplate;
  contractModule: ModuleType;
  templates: Array<ITemplate>;
  history?: Array<IContractHistory>;
}
