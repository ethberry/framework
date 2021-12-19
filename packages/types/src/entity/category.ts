import { IBase } from "@gemunion/types-collection";

import { IProduct } from "./product";

export interface ICategory extends IBase {
  title: string;
  description: string;
  parent: ICategory;
  parentId: number;
  children: Array<ICategory>;
  products: Array<IProduct>;
}
