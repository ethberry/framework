import type { IIdDateBase } from "@gemunion/types-collection";

import type { IAsset } from "../blockchain";
import type { IPhoto } from "./photo";
import type { IProduct } from "./product";
import type { IOrderItem } from "./order-item";
import type { IParameter } from "./parameter";
import type { ICustomParameter } from "./custom-parameter";

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
