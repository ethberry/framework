import type { ISearchDto, ISortDto } from "@ethberry/types-collection";

import type { IParamsDto } from "../../common";
import type { IProduct } from "../../../entities";

export interface IProductSearchDto extends ISearchDto, ISortDto<IProduct>, IParamsDto {
  categoryIds: Array<number>;
  merchantId?: number;
}
