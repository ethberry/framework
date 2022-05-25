import { IContract, ISearchable } from "@gemunion/types-collection";

import { IErc721Template } from "./template";

export enum Erc721CollectionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  NEW = "NEW",
}

export enum Erc721CollectionType {
  TOKEN = "TOKEN",
  DROPBOX = "DROPBOX",
  AIRDROP = "AIRDROP",
}

export enum Erc721TokenTemplate {
  "SIMPLE" = "SIMPLE", // ACBER
  "GRADED" = "GRADED", // ACBER + METADATA
  "RANDOM" = "RANDOM", // ACBER + METADATA + CHAINLINK
}

export interface IErc721Collection extends IContract, ISearchable {
  imageUrl: string;
  symbol: string;
  royalty: number;
  baseTokenURI?: string | null;
  collectionStatus: Erc721CollectionStatus;
  collectionType: Erc721CollectionType;
  erc721Templates?: Array<IErc721Template>;
  contractTemplate: Erc721TokenTemplate;
}
