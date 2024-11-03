import { Mixin } from "ts-mixer";

import { PaginationDto } from "@ethberry/collection";
import { AccountDto } from "@ethberry/nest-js-validators";
import { ILegacyVestingContractSearchDto, LegacyVestingContractFeatures } from "@framework/types";

export class LegacyVestingContractSearchDto extends Mixin(AccountDto, PaginationDto) implements ILegacyVestingContractSearchDto {
  public contractFeatures: Array<LegacyVestingContractFeatures>;
  public merchantId: number;
}
