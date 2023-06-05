import type { IIdDateBase } from "@gemunion/types-collection";

import { IAssetComponentHistory } from "../blockchain";
import { IProductItem } from "./product-item";

export interface IOrderItem extends IIdDateBase {
  orderId: number;
  productItemId: number;
  productItem?: IProductItem;
  exchange: Array<IAssetComponentHistory>;
  quantity: number;
}
