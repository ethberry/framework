import { IIdDateBase } from "@gemunion/types-collection";

import { IProductItem } from "./product-item";

export interface IStock extends IIdDateBase {
  productItemId: number;
  productItem?: IProductItem;
  totalStockQuantity: number;
  reservedStockQuantity: number;
}
