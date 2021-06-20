import {IMerchant} from "./merchant";
import {IPhoto} from "./photo";
import {IBase} from "./base";
import {ICategory} from "./category";
import {IOrder} from "./order";

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
  categories: Array<ICategory>;
  productStatus: ProductStatus;
  photos: Array<IPhoto>;
  orders: Array<IOrder>;
}
