import type { ISearchDto } from "@ethberry/types-collection";

import { DiscreteStatus } from "../../../../../entities";

export interface IDiscreteSearchDto extends ISearchDto {
  discreteStatus: Array<DiscreteStatus>;
  merchantId: number;
}
