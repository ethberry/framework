import { Mixin } from "ts-mixer";

import { PaginationDto } from "@ethberry/collection";
import { AccountDto } from "@ethberry/nest-js-validators";
import { ILegacyVestingContractSearchDto, VestingContractFeatures } from "@framework/types";

export class LegacyVestingContractSearchDto extends Mixin(AccountDto, PaginationDto) implements ILegacyVestingContractSearchDto {
  public contractFeatures: Array<VestingContractFeatures>;
  public merchantId: number;
}
