import { ISearchDto } from "@gemunion/types-collection";

import { Erc20VestingTemplate } from "../../../entities";

export interface IErc20VestingSearchDto extends ISearchDto {
  vestingTemplate: Array<Erc20VestingTemplate>;
}
