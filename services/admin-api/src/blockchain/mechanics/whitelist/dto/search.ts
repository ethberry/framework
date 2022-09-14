import { Mixin } from "ts-mixer";

import { AccountOptionalDto, PaginationDto } from "@gemunion/collection";
import { IWhitelistSearchDto } from "@framework/types";

export class WhitelistSearchDto extends Mixin(AccountOptionalDto, PaginationDto) implements IWhitelistSearchDto {}
