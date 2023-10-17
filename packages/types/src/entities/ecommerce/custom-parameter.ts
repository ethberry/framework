import type { IIdDateBase } from "@gemunion/types-collection";

import type { IUser } from "../infrastructure";
import { ParameterType } from "./parameter";
import type { IProductItem } from "./product-item";

export interface ICustomParameter extends IIdDateBase {
  productItemId: number;
  productItem?: IProductItem;
  parameterName: string;
  parameterType: ParameterType;
  parameterValue: string | null;
  userId: number;
  user?: IUser;
}
