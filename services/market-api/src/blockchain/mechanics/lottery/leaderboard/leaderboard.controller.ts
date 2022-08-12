import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";
import { LotteryLeaderboardService } from "./leaderboard.service";
import { LotteryLeaderboardSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/lottery/leaderboard")
export class LotteryLeaderboardController {
  constructor(private readonly lotteryLeaderboardService: LotteryLeaderboardService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: LotteryLeaderboardSearchDto): Promise<any> {
    return this.lotteryLeaderboardService.leaderboard(dto);
  }
}
