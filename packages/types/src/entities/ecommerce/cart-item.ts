import type { IIdBase } from "@gemunion/types-collection";

import { IProduct } from "./product";

export interface ICartItem extends IIdBase {
  productId: number;
  product?: IProduct;
  amount: number;
}
