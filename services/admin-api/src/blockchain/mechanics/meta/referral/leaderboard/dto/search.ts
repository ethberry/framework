import { Mixin } from "ts-mixer";

import { PaginationDto } from "@gemunion/collection";
import { AccountOptionalDto } from "@gemunion/nest-js-validators";
import { IReferralLeaderboardSearchDto } from "@framework/types";

export class ReferralLeaderboardSearchDto
  extends Mixin(AccountOptionalDto, PaginationDto)
  implements IReferralLeaderboardSearchDto {}
