import { IDeployable, ISearchable } from "@gemunion/types-collection";

import { IContractHistory } from "../contract-history";

import { ITemplate } from "./template";
import { ModuleType, TokenType } from "../common";

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
  "BLACKLIST" = "BLACKLIST", // ACBER + BLACKLIST
  "UPGRADEABLE" = "UPGRADEABLE", // ACBER + METADATA
  "RANDOM" = "RANDOM", // ACBER + METADATA + CHAINLINK
  // MODULE:MYSTERYBOX
  "MYSTERYBOX" = "MYSTERYBOX", // ACBER + METADATA + Unpack
}

export enum Erc998ContractFeatures {
  "BLACKLIST" = "BLACKLIST", // ACBER + BLACKLIST
  "UPGRADEABLE" = "UPGRADEABLE", // ACBER + METADATA
  "RANDOM" = "RANDOM", // ACBER + METADATA + CHAINLINK
}

export enum Erc1155ContractFeatures {
  "BLACKLIST" = "BLACKLIST",
}

// waiting for https://github.com/microsoft/TypeScript/issues/17592
export enum ContractFeatures {
  "NATIVE" = "NATIVE",
  "EXTERNAL" = "EXTERNAL",
  "BLACKLIST" = "BLACKLIST",
  "UPGRADEABLE" = "UPGRADEABLE",
  "RANDOM" = "RANDOM",
  // MODULE:MYSTERYBOX
  "MYSTERYBOX" = "MYSTERYBOX", // ACBER + METADATA + Unpack
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
  contractFeatures: Array<ContractFeatures>;
  contractModule: ModuleType;
  templates: Array<ITemplate>;
  history?: Array<IContractHistory>;
}
