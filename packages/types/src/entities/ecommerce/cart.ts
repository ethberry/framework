import type { IIdDateBase } from "@gemunion/types-collection";

import { ICartItem } from "./cart-item";

export interface ICart extends IIdDateBase {
  userId?: number;
  items: Array<ICartItem>;
}
