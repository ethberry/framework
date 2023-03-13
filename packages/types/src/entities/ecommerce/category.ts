import type { ISearchable } from "@gemunion/types-collection";

import { IProduct } from "./product";

export interface ICategory extends ISearchable {
  parent: ICategory;
  parentId: number;
  children: Array<ICategory>;
  products: Array<IProduct>;
}
