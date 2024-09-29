import { Mixin } from "ts-mixer";

import { PaginationDto } from "@ethberry/collection";
import { AccountOptionalDto } from "@ethberry/nest-js-validators";
import type { IReferralLeaderboardSearchDto } from "@framework/types";

export class ReferralLeaderboardSearchDto
  extends Mixin(AccountOptionalDto, PaginationDto)
  implements IReferralLeaderboardSearchDto {}
