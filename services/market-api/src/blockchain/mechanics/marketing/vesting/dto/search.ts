import { PaginationDto } from "@gemunion/collection";
import { IVestingSearchDto } from "@framework/types";

export class VestingSearchDto extends PaginationDto implements IVestingSearchDto {
  public account: string;
  public merchantId: number;
}
