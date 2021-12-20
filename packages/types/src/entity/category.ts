import { IIdBase } from "@gemunion/types-collection";

import { IProduct } from "./product";

export interface ICategory extends IIdBase {
  title: string;
  description: string;
  parent: ICategory;
  parentId: number;
  children: Array<ICategory>;
  products: Array<IProduct>;
}
