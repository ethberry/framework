import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { StakingHistoryService } from "./staking-history.service";
import { LeaderboardSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/staking-rules")
export class StakingHistoryController {
  constructor(private readonly erc721CollectionService: StakingHistoryService) {}

  @Get("/leaderboard")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: LeaderboardSearchDto): Promise<any> {
    return this.erc721CollectionService.leaderboard(dto);
  }
}
