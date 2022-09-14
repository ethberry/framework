import { Mixin } from "ts-mixer";

import { AccountOptionalDto, PaginationDto } from "@gemunion/collection";
import type { ILotteryLeaderboardSearchDto } from "@framework/types";

export class LotteryLeaderboardSearchDto
  extends Mixin(AccountOptionalDto, PaginationDto)
  implements ILotteryLeaderboardSearchDto {}
