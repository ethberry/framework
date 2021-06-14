import {IProduct} from "./product";
import {IBase} from "./base";

export enum PhotoStatus {
  NEW = "NEW",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
}

export interface IPhoto extends IBase {
  title: string;
  imageUrl: string;
  photoStatus: PhotoStatus;
  productId: number;
  product: IProduct;
}
