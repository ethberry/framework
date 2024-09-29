import { Mixin } from "ts-mixer";

import { SearchDto } from "@ethberry/collection";
import { AccountOptionalDto } from "@ethberry/nest-js-validators";
import type { IWaitListListSearchDto } from "@framework/types";

export class WaitListListSearchDto extends Mixin(AccountOptionalDto, SearchDto) implements IWaitListListSearchDto {
  public merchantId: number;
}
