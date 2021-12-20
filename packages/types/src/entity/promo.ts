import { IIdBase } from "@gemunion/types-collection";

import { IProduct } from "./product";

export interface IPromo extends IIdBase {
  title: string;
  description: string;
  product?: IProduct;
  productId: number;
  imageUrl: string;
}
