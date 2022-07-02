import { ISearchDto } from "@gemunion/types-collection";

import { VestingTemplate } from "../../../entities";

export interface IVestingSearchDto extends ISearchDto {
  contractTemplate: Array<VestingTemplate>;
}
