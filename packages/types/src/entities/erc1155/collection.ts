import { IContract, ISearchable } from "@gemunion/types-collection";

import { IErc1155Token } from "./token";

export enum Erc1155CollectionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}

export enum Erc1155TokenTemplate {
  "SIMPLE" = "SIMPLE", // ACBS
}

export interface IErc1155Collection extends IContract, ISearchable {
  imageUrl: string;
  baseTokenURI?: string | null;
  collectionStatus: Erc1155CollectionStatus;
  contractTemplate: Erc1155TokenTemplate;
  erc1155Tokens?: Array<IErc1155Token>;
}
