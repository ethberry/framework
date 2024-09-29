import type { IIdDateBase } from "@ethberry/types-collection";

import type { IAssetComponentHistory } from "../blockchain";
import type { IProductItem } from "./product-item";

export interface IOrderItem extends IIdDateBase {
  orderId: number;
  productItemId: number;
  productItem?: IProductItem;
  exchange: Array<IAssetComponentHistory>;
  quantity: number;
}
