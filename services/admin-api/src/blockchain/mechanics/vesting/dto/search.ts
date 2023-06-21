import { Mixin } from "ts-mixer";

import { AccountOptionalDto, PaginationDto } from "@gemunion/collection";
import { IVestingSearchDto } from "@framework/types";

export class VestingSearchDto extends Mixin(AccountOptionalDto, PaginationDto) implements IVestingSearchDto {}
