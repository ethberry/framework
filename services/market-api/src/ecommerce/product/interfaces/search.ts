import type { ISearchDto, ISortDto } from "@gemunion/types-collection";
import type { IProduct } from "@framework/types";

import type { IParamsDto } from "./params";

export interface IProductSearchDto extends ISearchDto, ISortDto<IProduct>, IParamsDto {
  categoryIds: Array<number>;
  merchantId?: number;
}
