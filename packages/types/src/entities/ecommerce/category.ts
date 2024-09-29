import type { ISearchable } from "@ethberry/types-collection";

import type { IProduct } from "./product";

export interface ICategory extends ISearchable {
  parent: ICategory;
  parentId: number;
  children: Array<ICategory>;
  products: Array<IProduct>;
}
