import { IIdDateBase } from "@gemunion/types-collection";

import { IErc1155Collection } from "./collection";

export enum Erc1155TokenStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IErc1155Token extends IIdDateBase {
  title: string;
  description: string;
  imageUrl: string;
  attributes: any;
  price: string;
  amount: number;
  tokenId: string;
  tokenStatus: Erc1155TokenStatus;
  erc1155CollectionId: number;
  erc1155Collection?: IErc1155Collection;
}
