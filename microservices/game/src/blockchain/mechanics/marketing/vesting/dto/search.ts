import { Mixin } from "ts-mixer";

import { AccountDto, PaginationDto } from "@gemunion/collection";
import { IVestingSearchDto } from "@framework/types";

export class VestingSearchDto extends Mixin(AccountDto, PaginationDto) implements IVestingSearchDto {
  public merchantId: number;
}
