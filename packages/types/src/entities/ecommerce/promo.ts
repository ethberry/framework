import type { IIdDateBase } from "@gemunion/types-collection";

import type { IProduct } from "./product";

export interface IProductPromo extends IIdDateBase {
  title: string;
  product?: IProduct;
  productId: number;
  imageUrl: string;
}
