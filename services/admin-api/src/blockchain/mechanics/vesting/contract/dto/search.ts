import { Mixin } from "ts-mixer";

import { AccountOptionalDto, PaginationDto } from "@gemunion/collection";
import { IVestingSearchDto } from "@framework/types";

export class VestingContractSearchDto extends Mixin(AccountOptionalDto, PaginationDto) implements IVestingSearchDto {
  public merchantId: number;
}
