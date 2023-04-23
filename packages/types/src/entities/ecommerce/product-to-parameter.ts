import { IProduct } from "./product";
import { IParameter } from "./parameter";

export interface IProductToParameter {
  productId: number;
  product: IProduct;
  parameterId: number;
  parameter: IParameter;
  parameterValue: string;
}
