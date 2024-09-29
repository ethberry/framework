import type { ISearchDto } from "@ethberry/types-collection";

import { RentRuleStatus } from "../../../../../entities";

export interface IRentSearchDto extends ISearchDto {
  contractIds: Array<number>;
  rentStatus: Array<RentRuleStatus>;
}
