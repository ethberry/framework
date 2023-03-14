import { ISearchDto, ISortDto } from "@gemunion/types-collection";
import { IProduct } from "@framework/types";

import { IParamsDto } from "./params";

export interface IProductSearchDto extends ISearchDto, ISortDto<IProduct>, IParamsDto {
  categoryIds: Array<number>;
  merchantId?: number;
}
