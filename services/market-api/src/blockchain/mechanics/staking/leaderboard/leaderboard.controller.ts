import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { StakingLeaderboardService } from "./leaderboard.service";
import { LeaderboardSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/staking/leaderboard")
export class StakingLeaderboardController {
  constructor(private readonly stakingLeaderboardService: StakingLeaderboardService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: LeaderboardSearchDto): Promise<any> {
    return this.stakingLeaderboardService.leaderboard(dto);
  }
}
