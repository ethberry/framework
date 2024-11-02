import type { IPaginationDto } from "@ethberry/types-collection";
import { VestingContractFeatures } from "../../../../../entities";

export interface ILegacyVestingContractSearchDto extends IPaginationDto {
  contractFeatures: Array<VestingContractFeatures>;
  account: string;
  merchantId: number;
}
