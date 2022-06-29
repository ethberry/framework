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
  "ERC20_SIMPLE" = "ERC20_SIMPLE", // ACBCS
  "ERC20_BLACKLIST" = "ERC20_BLACKLIST", // ACBCS + BLACKLIST
  "ERC20_EXTERNAL" = "ERC20_EXTERNAL", // any 3rd party token
  "ERC20_NATIVE" = "ERC20_NATIVE", // ETH
}

export enum Erc721ContractTemplate {
  "ERC721_SIMPLE" = "ERC721_SIMPLE", // ACBER
  "ERC721_GRADED" = "ERC721_GRADED", // ACBER + METADATA
  "ERC721_RANDOM" = "ERC721_RANDOM", // ACBER + METADATA + CHAINLINK
}

export enum Erc998ContractTemplate {
  "ERC998_SIMPLE" = "ERC998_SIMPLE", // ACBER
  "ERC998_GRADED" = "ERC998_GRADED", // ACBER + METADATA
  "ERC998_RANDOM" = "ERC998_RANDOM", // ACBER + METADATA + CHAINLINK
}

export enum Erc1155ContractTemplate {
  "ERC1155_SIMPLE" = "ERC1155_SIMPLE", // ACBS
}

// waiting for https://github.com/microsoft/TypeScript/issues/17592
export enum UniContractTemplate {
  "UNKNOWN" = "UNKNOWN", // for external contracts

  "ERC20_SIMPLE" = "ERC20_SIMPLE", // ACBCS
  "ERC20_BLACKLIST" = "ERC20_BLACKLIST", // ACBCS + BLACKLIST
  "ERC20_EXTERNAL" = "ERC20_EXTERNAL", // any 3rd party token
  "ERC20_NATIVE" = "ERC20_NATIVE", // ETH

  "ERC721_SIMPLE" = "ERC721_SIMPLE", // ACBER
  "ERC721_GRADED" = "ERC721_GRADED", // ACBER + METADATA
  "ERC721_RANDOM" = "ERC721_RANDOM", // ACBER + METADATA + CHAINLINK

  "ERC998_SIMPLE" = "ERC998_SIMPLE", // ACBER
  "ERC998_GRADED" = "ERC998_GRADED", // ACBER + METADATA
  "ERC998_RANDOM" = "ERC998_RANDOM", // ACBER + METADATA + CHAINLINK

  "ERC1155_SIMPLE" = "ERC1155_SIMPLE", // ACBS
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
