import { ClassSerializerInterceptor, Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";
import { ISearchDto } from "@gemunion/types-collection";

import { StakingService } from "./staking.service";
import { StakingEntity } from "./staking.entity";

@ApiBearerAuth()
@Controller("/staking")
export class StakingController {
  constructor(private readonly stakingService: StakingService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  public search(@Query() dto: ISearchDto): Promise<[Array<StakingEntity>, number]> {
    return this.stakingService.search(dto);
  }

  @Get("/leaderboard")
  @UseInterceptors(PaginationInterceptor)
  public leaderboard(): Promise<any> {
    return this.stakingService.leaderboard();
  }
}
