import type { IIdDateBase } from "@gemunion/types-collection";

import type { ICustomParameter } from "./custom-parameter";
import type { IParameter } from "./parameter";
import type { IProductItem } from "./product-item";

export interface IProductItemParameter extends IIdDateBase {
  productItemId: number;
  productItem?: IProductItem;
  parameterId: number | null;
  parameter?: IParameter;
  customParameter?: ICustomParameter;
  customParameterId: number | null;
  userCustomValue: string;
}
