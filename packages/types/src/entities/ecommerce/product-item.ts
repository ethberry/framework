import type { IIdDateBase } from "@gemunion/types-collection";

import { IAsset } from "../blockchain";
import { IPhoto } from "./photo";
import { IProduct } from "./product";
import { IOrderItem } from "./order-item";
import { IParameter } from "./parameter";
import { ICustomParameter } from "./custom-parameter";

export interface IProductItem extends IIdDateBase {
  productId: number;
  product?: IProduct;
  priceId: number;
  price?: IAsset;
  parameters?: Array<IParameter | ICustomParameter>;
  maxQuantity?: number | null;
  minQuantity: number;
  orderItems?: Array<IOrderItem>;
  sku: string;
  photo: IPhoto;
}
