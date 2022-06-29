import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { StakingHistoryService } from "./staking-history.service";
import { LeaderboardSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/staking")
export class StakingHistoryController {
  constructor(private readonly stakingHistoryService: StakingHistoryService) {}

  @Get("/leaderboard")
  // @UseInterceptors(PaginationInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public search(@Query() dto: LeaderboardSearchDto): Promise<any> {
    return this.stakingHistoryService.leaderboard(dto);
  }
}
