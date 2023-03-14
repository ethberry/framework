import type { IIdDateBase } from "@gemunion/types-collection";

import { IProduct } from "./product";

export interface IPromo extends IIdDateBase {
  title: string;
  product?: IProduct;
  productId: number;
  imageUrl: string;
}
