import { IContract, ISearchable } from "@gemunion/types-collection";

import { IErc1155Token } from "./token";

export enum Erc1155CollectionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum Erc1155TokenTemplate {
  "SIMPLE" = "SIMPLE", // ACBS
}

export interface IErc1155Collection extends IContract, ISearchable {
  imageUrl: string;
  baseUri?: string | null;
  collectionStatus: Erc1155CollectionStatus;
  erc1155Tokens?: Array<IErc1155Token>;
}
