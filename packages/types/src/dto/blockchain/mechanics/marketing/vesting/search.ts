import type { IPaginationDto } from "@gemunion/types-collection";
import { VestingContractFeatures } from "../../../../../entities";

export interface IVestingSearchDto extends IPaginationDto {
  contractFeatures: Array<VestingContractFeatures>;
  account: string;
  merchantId: number;
}
