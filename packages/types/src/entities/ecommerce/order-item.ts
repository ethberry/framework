import type { IIdDateBase } from "@gemunion/types-collection";

import { IProduct } from "./product";

export interface IOrderItem extends IIdDateBase {
  productId: number;
  product?: IProduct;
  amount: number;
}
