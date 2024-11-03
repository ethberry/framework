import { PaginationDto } from "@ethberry/collection";
import { ILegacyVestingContractSearchDto, LegacyVestingContractFeatures } from "@framework/types";

export class VestingSearchDto extends PaginationDto implements ILegacyVestingContractSearchDto {
  public contractFeatures: Array<LegacyVestingContractFeatures>;
  public account: string;
  public merchantId: number;
}
