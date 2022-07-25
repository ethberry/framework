import { ISearchDto } from "@gemunion/types-collection";

import { VestingContractTemplate } from "../../../entities";

export interface IVestingSearchDto extends ISearchDto {
  contractTemplate: Array<VestingContractTemplate>;
}
