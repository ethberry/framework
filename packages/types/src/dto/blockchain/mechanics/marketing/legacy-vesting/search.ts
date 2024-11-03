import type { IPaginationDto } from "@ethberry/types-collection";
import { LegacyVestingContractFeatures } from "../../../../../entities";

export interface ILegacyVestingContractSearchDto extends IPaginationDto {
  contractFeatures: Array<LegacyVestingContractFeatures>;
  account: string;
  merchantId: number;
}
