import type { IIdBase } from "@gemunion/types-collection";

import { IProductItem } from "./product-item";

export interface ICartItem extends IIdBase {
  productItemId: number;
  productItem?: IProductItem;
  amount: number;
}
