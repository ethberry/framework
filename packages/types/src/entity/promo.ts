import { IBase } from "@gemunion/types-collection";

import { IProduct } from "./product";

export interface IPromo extends IBase {
  title: string;
  description: string;
  product?: IProduct;
  productId: number;
  imageUrl: string;
}
