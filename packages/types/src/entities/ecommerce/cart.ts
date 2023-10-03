import type { IIdDateBase } from "@gemunion/types-collection";

import type { ICartItem } from "./cart-item";

export interface ICart extends IIdDateBase {
  userId?: number;
  items: Array<ICartItem>;
}
