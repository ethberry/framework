import type { ISearchable } from "@gemunion/types-collection";

import { ICategory } from "./category";
import { IMerchant } from "../infrastructure";
import { IPhoto } from "./photo";
import { IAsset } from "../blockchain";
import { IParameter } from "../common";

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum ProductColor {
  RED = "RED",
  BLUE = "BLUE",
  GREEN = "GREEN",
}

export enum ProductSize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
}

export enum ProductParameters {
  COLOR = "COLOR",
  SIZE = "SIZE",
}

export interface IProduct extends ISearchable {
  parameters: Array<IParameter>;
  price?: IAsset;
  priceId: number;
  amount: number;
  merchantId: number;
  merchant?: IMerchant;
  productStatus: ProductStatus;
  photos: Array<IPhoto>;
  categories: Array<ICategory>;
}
