import { ISearchDto, ISortDto } from "@gemunion/types-collection";

import { IParamsDto } from "../../common";
import { IProduct } from "../../../entities";

export interface IProductSearchDto extends ISearchDto, ISortDto<IProduct>, IParamsDto {
  categoryIds: Array<number>;
  merchantId?: number;
}
