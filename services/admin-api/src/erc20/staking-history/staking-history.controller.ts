import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc20StakingHistoryService } from "./staking-history.service";
import { Erc20LeaderboardSearchDto } from "./dto";
import { ILeaderboard } from "./interfaces";

@ApiBearerAuth()
@Controller("/erc20-staking-history")
export class Erc20StakingController {
  constructor(private readonly erc721CollectionService: Erc20StakingHistoryService) {}

  @Get("/staking")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc20LeaderboardSearchDto): Promise<[Array<ILeaderboard>, number]> {
    return this.erc721CollectionService.leaderboard(dto);
  }
}
