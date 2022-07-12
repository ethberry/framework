import { IDeployable, ISearchable } from "@gemunion/types-collection";

import { IErc20ContractHistory } from "../../erc20/token-history";
import { IErc721TokenHistory } from "../../erc721/token-history";
import { IErc998TokenHistory } from "../../erc998/token-history";
import { IErc1155TokenHistory } from "../../erc1155/token-history";
import { ITemplate } from "./template";
import { TokenType } from "../common";

export enum ContractStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  NEW = "NEW",
}

export enum ContractRole {
  TOKEN = "TOKEN",
  DROPBOX = "DROPBOX",
  AIRDROP = "AIRDROP",
}

export enum Erc20ContractTemplate {
  "SIMPLE" = "SIMPLE", // ACBCS
  "BLACKLIST" = "BLACKLIST", // ACBCS + BLACKLIST
  "EXTERNAL" = "EXTERNAL", // any 3rd party token
  "NATIVE" = "NATIVE", // ETH
}

export enum Erc721ContractTemplate {
  "SIMPLE" = "SIMPLE", // ACBER
  "GRADED" = "GRADED", // ACBER + METADATA
  "RANDOM" = "RANDOM", // ACBER + METADATA + CHAINLINK
}

export enum Erc998ContractTemplate {
  "SIMPLE" = "SIMPLE", // ACBER
  "GRADED" = "GRADED", // ACBER + METADATA
  "RANDOM" = "RANDOM", // ACBER + METADATA + CHAINLINK
}

export enum Erc1155ContractTemplate {
  "SIMPLE" = "SIMPLE", // ACBS
}

// waiting for https://github.com/microsoft/TypeScript/issues/17592
export enum ContractTemplate {
  "UNKNOWN" = "UNKNOWN",
  "SIMPLE" = "SIMPLE",
  "BLACKLIST" = "BLACKLIST",
  "EXTERNAL" = "EXTERNAL",
  "NATIVE" = "NATIVE",
  "GRADED" = "GRADED",
  "RANDOM" = "RANDOM",
}

export interface IContract extends IDeployable, ISearchable {
  imageUrl: string;
  name: string;
  symbol: string;
  royalty: number;
  baseTokenURI: string;
  contractStatus: ContractStatus;
  contractType: TokenType;
  contractRole: ContractRole;
  contractTemplate: ContractTemplate;
  templates: Array<ITemplate>;
  history?: Array<IErc20ContractHistory | IErc721TokenHistory | IErc998TokenHistory | IErc1155TokenHistory>;
}
