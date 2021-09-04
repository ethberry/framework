import { IProduct } from "./product";
import { IBase } from "./base";

export interface ICategory extends IBase {
  title: string;
  description: string;
  parent: ICategory;
  parentId: number;
  children: Array<ICategory>;
  products: Array<IProduct>;
}
