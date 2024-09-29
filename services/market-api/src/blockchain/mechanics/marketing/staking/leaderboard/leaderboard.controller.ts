import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@ethberry/nest-js-utils";

import { StakingLeaderboardService } from "./leaderboard.service";
import { StakingLeaderboardSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/staking/leaderboard")
export class StakingLeaderboardController {
  constructor(private readonly stakingLeaderboardService: StakingLeaderboardService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: StakingLeaderboardSearchDto): Promise<any> {
    return this.stakingLeaderboardService.leaderboard(dto);
  }
}
