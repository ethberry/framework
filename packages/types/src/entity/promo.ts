import { IProduct } from "./product";
import { IBase } from "./base";

export interface IPromo extends IBase {
  title: string;
  description: string;
  product?: IProduct;
  productId: number;
  imageUrl: string;
}
