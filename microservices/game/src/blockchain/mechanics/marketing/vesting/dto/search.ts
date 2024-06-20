import { Mixin } from "ts-mixer";

import { PaginationDto } from "@gemunion/collection";
import { AccountDto } from "@gemunion/nest-js-validators";
import { IVestingSearchDto, VestingContractFeatures } from "@framework/types";

export class VestingSearchDto extends Mixin(AccountDto, PaginationDto) implements IVestingSearchDto {
  public contractFeatures: Array<VestingContractFeatures>;
  public merchantId: number;
}
