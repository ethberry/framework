import { IIdBase } from "@gemunion/types-collection";

import { IProduct } from "./product";

export enum PhotoStatus {
  NEW = "NEW",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
}

export interface IPhoto extends IIdBase {
  title: string;
  imageUrl: string;
  photoStatus: PhotoStatus;
  priority: number;
  productId: number;
  product: IProduct;
}
