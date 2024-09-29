import type { IIdDateBase } from "@ethberry/types-collection";

import type { IProductItem } from "./product-item";

export interface IStock extends IIdDateBase {
  productItemId: number;
  productItem?: IProductItem;
  totalStockQuantity: number;
  reservedStockQuantity: number;
}
