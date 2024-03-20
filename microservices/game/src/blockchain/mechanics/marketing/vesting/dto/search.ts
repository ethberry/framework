import { Mixin } from "ts-mixer";

import { PaginationDto } from "@gemunion/collection";
import { AccountDto } from "@gemunion/nest-js-validators";
import { IVestingSearchDto } from "@framework/types";

export class VestingSearchDto extends Mixin(AccountDto, PaginationDto) implements IVestingSearchDto {
  public merchantId: number;
}
