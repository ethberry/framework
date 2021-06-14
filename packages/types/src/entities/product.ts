import {IMerchant} from "./merchant";
import {IPhoto} from "./photo";
import {IBase} from "./base";

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IProduct extends IBase {
  title: string;
  description: string;
  price: number;
  amount: number;
  merchantId: number;
  merchant?: IMerchant;
  productStatus: ProductStatus;
  photos: Array<IPhoto>;
}
