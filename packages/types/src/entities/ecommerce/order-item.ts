import type { IIdDateBase } from "@gemunion/types-collection";

import { IProductItem } from "./product-item";

export interface IOrderItem extends IIdDateBase {
  orderId: number;
  productItemId: number;
  productItem?: IProductItem;
  pricePerUnit: number;
  amount: number;
}
