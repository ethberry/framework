import { Mixin } from "ts-mixer";

import { SearchDto } from "@gemunion/collection";
import { AccountOptionalDto } from "@gemunion/nest-js-validators";
import type { IWaitListListSearchDto } from "@framework/types";

export class WaitListListSearchDto extends Mixin(AccountOptionalDto, SearchDto) implements IWaitListListSearchDto {
  public merchantId: number;
}
