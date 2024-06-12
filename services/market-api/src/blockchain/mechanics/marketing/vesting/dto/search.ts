import { PaginationDto } from "@gemunion/collection";
import { IVestingSearchDto, VestingContractFeatures } from "@framework/types";

export class VestingSearchDto extends PaginationDto implements IVestingSearchDto {
  public account: string;
  public merchantId: number;
  public contractFeatures: VestingContractFeatures[];
}
