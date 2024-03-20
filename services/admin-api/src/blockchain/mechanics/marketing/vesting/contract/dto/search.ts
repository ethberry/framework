import { Mixin } from "ts-mixer";

import { PaginationDto } from "@gemunion/collection";
import { AccountOptionalDto } from "@gemunion/nest-js-validators";
import { IVestingSearchDto } from "@framework/types";

export class VestingContractSearchDto extends Mixin(AccountOptionalDto, PaginationDto) implements IVestingSearchDto {
  public merchantId: number;
}
