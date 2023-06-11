import type { IIdDateBase } from "@gemunion/types-collection";

import { IProduct } from "./product";
import { IProductItem } from "./product-item";

export enum PhotoStatus {
  NEW = "NEW",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
}

export interface IPhoto extends IIdDateBase {
  title: string;
  imageUrl: string;
  photoStatus: PhotoStatus;
  product?: IProduct | null;
  productId: number | null;
  productItem?: IProductItem | null;
  productItemId: number | null;
  priority: number;
}
