import { ISearchDto } from "@gemunion/types-collection";

import { CraftStatus } from "../../../entities";

export interface IExchangeSearchDto extends ISearchDto {
  craftStatus: Array<CraftStatus>;
}
