import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";
import { RaffleLeaderboardService } from "./leaderboard.service";
import { RaffleLeaderboardSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/raffle/leaderboard")
export class RaffleLeaderboardController {
  constructor(private readonly raffleLeaderboardService: RaffleLeaderboardService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: RaffleLeaderboardSearchDto): Promise<any> {
    return this.raffleLeaderboardService.leaderboard(dto);
  }
}
