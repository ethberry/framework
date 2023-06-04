import { IIdDateBase } from "@gemunion/types-collection";

import { IUser } from "../infrastructure";
import { ParameterType } from "./parameter";
import { IProductItem } from "./product-item";

export interface ICustomParameter extends IIdDateBase {
  productItemId: number;
  productItem?: IProductItem;
  parameterName: string;
  parameterType: ParameterType;
  parameterValue: string | null;
  userId: number;
  user?: IUser;
}
