import { PaginationDto } from "@ethberry/collection";
import { ILegacyVestingContractSearchDto, VestingContractFeatures } from "@framework/types";

export class VestingSearchDto extends PaginationDto implements ILegacyVestingContractSearchDto {
  public contractFeatures: Array<VestingContractFeatures>;
  public account: string;
  public merchantId: number;
}
