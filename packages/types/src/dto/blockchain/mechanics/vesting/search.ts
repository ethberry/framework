import type { IPaginationDto } from "@gemunion/types-collection";

import { VestingContractTemplate } from "../../../../entities";

export interface IVestingSearchDto extends IPaginationDto {
  account: string;
  contractTemplate: Array<VestingContractTemplate>;
}
