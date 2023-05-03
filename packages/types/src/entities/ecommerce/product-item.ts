import type { IIdDateBase } from "@gemunion/types-collection";

import { IAsset } from "../blockchain";
import { IProduct } from "./product";

export interface IProductItem extends IIdDateBase {
  productId: number;
  product: IProduct;
  assetId: number;
  asset: IAsset;
  minQuantity: number;
  sku: string;
  imageUrl: string;
  weight: number;
}
