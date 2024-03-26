import { Mixin } from "ts-mixer";

import { PaginationDto } from "@gemunion/collection";
import { AccountOptionalDto } from "@gemunion/nest-js-validators";
import type { IReferralLeaderboardSearchDto } from "@framework/types";

export class ReferralLeaderboardSearchDto
  extends Mixin(AccountOptionalDto, PaginationDto)
  implements IReferralLeaderboardSearchDto {}
