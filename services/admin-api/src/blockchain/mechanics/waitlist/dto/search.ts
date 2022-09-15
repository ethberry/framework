import { Mixin } from "ts-mixer";

import { AccountOptionalDto, PaginationDto } from "@gemunion/collection";
import { IWaitlistSearchDto } from "@framework/types";

export class WaitlistSearchDto extends Mixin(AccountOptionalDto, PaginationDto) implements IWaitlistSearchDto {}
