import type { IIdDateBase } from "@gemunion/types-collection";

import { IProduct } from "./product";

export enum PhotoStatus {
  NEW = "NEW",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
}

export interface IPhoto extends IIdDateBase {
  title: string;
  imageUrl: string;
  photoStatus: PhotoStatus;
  productId: number;
  priority: number;
  product: IProduct;
}
