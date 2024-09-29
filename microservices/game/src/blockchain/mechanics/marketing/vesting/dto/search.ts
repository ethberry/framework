import { Mixin } from "ts-mixer";

import { PaginationDto } from "@ethberry/collection";
import { AccountDto } from "@ethberry/nest-js-validators";
import { IVestingSearchDto, VestingContractFeatures } from "@framework/types";

export class VestingSearchDto extends Mixin(AccountDto, PaginationDto) implements IVestingSearchDto {
  public contractFeatures: Array<VestingContractFeatures>;
  public merchantId: number;
}
