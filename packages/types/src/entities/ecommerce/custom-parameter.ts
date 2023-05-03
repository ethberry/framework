import { IIdDateBase } from "@gemunion/types-collection";

import { IUser } from "../infrastructure";
import { IProduct } from "./product";
import { ParameterType } from "./parameter";

export interface ICustomParameter extends IIdDateBase {
  productId: number;
  product: IProduct;
  parameterName: string;
  parameterType: ParameterType;
  parameterValue: string;
  userId: number;
  user?: IUser;
}
