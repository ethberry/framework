import { IContract, ISearchable } from "@gemunion/types-collection";

import { IErc721Template } from "./template";

export enum Erc721CollectionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum Erc721CollectionType {
  TOKEN = "TOKEN",
  DROPBOX = "DROPBOX",
  AIRDROP = "AIRDROP",
}

export interface IErc721Collection extends IContract, ISearchable {
  imageUrl: string;
  address: string;
  royalty: number;
  collectionStatus: Erc721CollectionStatus;
  collectionType: Erc721CollectionType;
  erc721Templates?: Array<IErc721Template>;
}
