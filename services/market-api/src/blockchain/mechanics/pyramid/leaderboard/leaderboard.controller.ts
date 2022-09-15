import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { PyramidLeaderboardService } from "./leaderboard.service";
import { PyramidLeaderboardSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/pyramid/leaderboard")
export class PyramidLeaderboardController {
  constructor(private readonly pyramidLeaderboardService: PyramidLeaderboardService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PyramidLeaderboardSearchDto): Promise<any> {
    return this.pyramidLeaderboardService.leaderboard(dto);
  }
}
