import { Mixin } from "ts-mixer";

import { AccountOptionalDto, PaginationDto } from "@gemunion/collection";
import type { IRaffleLeaderboardSearchDto } from "@framework/types";

export class RaffleLeaderboardSearchDto
  extends Mixin(AccountOptionalDto, PaginationDto)
  implements IRaffleLeaderboardSearchDto {}
