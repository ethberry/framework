import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { PonziLeaderboardService } from "./leaderboard.service";
import { PonziLeaderboardSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/ponzi/leaderboard")
export class PonziLeaderboardController {
  constructor(private readonly ponziLeaderboardService: PonziLeaderboardService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PonziLeaderboardSearchDto): Promise<any> {
    return this.ponziLeaderboardService.leaderboard(dto);
  }
}
