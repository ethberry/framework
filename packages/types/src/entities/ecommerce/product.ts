import type { ISearchable } from "@gemunion/types-collection";

import { ICategory } from "./category";
import { IMerchant } from "../infrastructure";
import { IPhoto } from "./photo";
import { IProductItem } from "./product-item";

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IProduct extends ISearchable {
  categories: Array<ICategory>;
  merchant?: IMerchant;
  merchantId: number;
  photos: Array<IPhoto>;
  productItems: Array<IProductItem>;
  productStatus: ProductStatus;
  length: number;
  height: number;
  width: number;
}
