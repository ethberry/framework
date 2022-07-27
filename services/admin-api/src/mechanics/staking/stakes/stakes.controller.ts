import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { StakingStakesEntity } from "./stakes.entity";
import { StakingStakesService } from "./stakes.service";
import { StakingStakesSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/staking/stakes")
export class StakingStakesController {
  constructor(private readonly stakesService: StakingStakesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: StakingStakesSearchDto): Promise<[Array<StakingStakesEntity>, number]> {
    return this.stakesService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<StakingStakesEntity | null> {
    return this.stakesService.findOne({ id });
  }
}
