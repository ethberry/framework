import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { StakingService } from "./staking.service";

@ApiBearerAuth()
@Controller("/staking")
export class StakingController {
  constructor(private readonly erc721CollectionService: StakingService) {}

  @Get("/leaderboard")
  @UseInterceptors(PaginationInterceptor)
  public search(): Promise<any> {
    return this.erc721CollectionService.search();
  }
}
