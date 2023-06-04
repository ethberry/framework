import type { IIdDateBase } from "@gemunion/types-collection";

import { IProductItem } from "./product-item";

export interface ICartItem extends IIdDateBase {
  cartId: number;
  productItemId: number;
  productItem?: IProductItem;
  quantity: number;
}
