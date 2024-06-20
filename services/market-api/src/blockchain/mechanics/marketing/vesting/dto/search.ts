import { PaginationDto } from "@gemunion/collection";
import { IVestingSearchDto, VestingContractFeatures } from "@framework/types";

export class VestingSearchDto extends PaginationDto implements IVestingSearchDto {
  public contractFeatures: Array<VestingContractFeatures>;
  public account: string;
  public merchantId: number;
}
