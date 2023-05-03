import type { ISearchable } from "@gemunion/types-collection";

import { ICategory } from "./category";
import { IMerchant } from "../infrastructure";
import { IPhoto } from "./photo";
import { IAsset } from "../blockchain";

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IProduct extends ISearchable {
  price?: IAsset;
  priceId: number;
  amount: number;
  merchantId: number;
  merchant?: IMerchant;
  productStatus: ProductStatus;
  photos: Array<IPhoto>;
  categories: Array<ICategory>;
  length: number;
  height: number;
  width: number;
}
