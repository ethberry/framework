import { IIdDateBase } from "@gemunion/types-collection";

import { ICustomParameter } from "./custom-parameter";
import { IParameter } from "./parameter";
import { IProductItem } from "./product-item";

export interface IProductItemParameter extends IIdDateBase {
  productItemId: number;
  productItem?: IProductItem;
  parameterId: number | null;
  parameter?: IParameter;
  customParameter?: ICustomParameter;
  customParameterId: number | null;
  userCustomValue: string;
}
