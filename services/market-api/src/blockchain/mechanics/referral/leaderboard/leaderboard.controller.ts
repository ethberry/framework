import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";
import { ReferralLeaderboardService } from "./leaderboard.service";
import { LeaderboardSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/referral/leaderboard")
export class ReferralLeaderboardController {
  constructor(private readonly referralLeaderboardService: ReferralLeaderboardService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: LeaderboardSearchDto): Promise<any> {
    return this.referralLeaderboardService.leaderboard(dto);
  }
}
