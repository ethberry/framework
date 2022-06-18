import { IContract, ISearchable } from "@gemunion/types-collection";

import { IErc998Template } from "./template";

export enum Erc998CollectionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  NEW = "NEW",
}

export enum Erc998CollectionType {
  TOKEN = "TOKEN",
  DROPBOX = "DROPBOX",
  AIRDROP = "AIRDROP",
}

export enum Erc998TokenTemplate {
  "SIMPLE" = "SIMPLE", // ACBER
  "GRADED" = "GRADED", // ACBER + METADATA
  "RANDOM" = "RANDOM", // ACBER + METADATA + CHAINLINK
}

export interface IErc998Collection extends IContract, ISearchable {
  imageUrl: string;
  name: string;
  symbol: string;
  royalty: number;
  baseTokenURI: string;
  collectionStatus: Erc998CollectionStatus;
  collectionType: Erc998CollectionType;
  erc998Templates?: Array<IErc998Template>;
  contractTemplate: Erc998TokenTemplate;
}
