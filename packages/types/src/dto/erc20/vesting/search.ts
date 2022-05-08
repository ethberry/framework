import { ISearchDto } from "@gemunion/types-collection";

import { Erc20VestingType } from "../../../entities";

export interface IErc20VestingSearchDto extends ISearchDto {
  vestingType: Array<Erc20VestingType>;
  erc20TokenIds: Array<number>;
}
