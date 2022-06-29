import { IContract, ISearchable } from "@gemunion/types-collection";

import { IErc20TokenHistory } from "../erc20/token-history";
import { IErc721TokenHistory } from "../erc721/token-history";
import { IUniTokenHistory } from "../erc998/token-history";
import { IErc1155TokenHistory } from "../erc1155/token-history";
import { IUniTemplate } from "./uni-template";
import { TokenType } from "../blockchain/common";

export enum UniContractStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  NEW = "NEW",
}

export enum UniContractRole {
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
export enum UniContractTemplate {
  "UNKNOWN" = "UNKNOWN",
  "SIMPLE" = "SIMPLE",
  "BLACKLIST" = "BLACKLIST",
  "EXTERNAL" = "EXTERNAL",
  "NATIVE" = "NATIVE",
  "GRADED" = "GRADED",
  "RANDOM" = "RANDOM",
}

export interface IUniContract extends IContract, ISearchable {
  imageUrl: string;
  name: string;
  symbol: string;
  royalty: number;
  baseTokenURI: string;
  contractStatus: UniContractStatus;
  contractType: TokenType;
  contractRole: UniContractRole;
  contractTemplate: UniContractTemplate;
  uniTemplates: Array<IUniTemplate>;
  history?: Array<IErc20TokenHistory | IErc721TokenHistory | IUniTokenHistory | IErc1155TokenHistory>;
}
