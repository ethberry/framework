import { Mixin } from "ts-mixer";

import { AccountOptionalDto, PaginationDto } from "@gemunion/collection";
import { IReferralLeaderboardSearchDto } from "@framework/types";

export class ReferralLeaderboardSearchDto
  extends Mixin(AccountOptionalDto, PaginationDto)
  implements IReferralLeaderboardSearchDto {}
