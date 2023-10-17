import type { ISearchable } from "@gemunion/types-collection";

import type { ICategory } from "./category";
import type { IMerchant } from "../infrastructure";
import type { IPhoto } from "./photo";
import type { IProductItem } from "./product-item";

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
  weight: number;
}
