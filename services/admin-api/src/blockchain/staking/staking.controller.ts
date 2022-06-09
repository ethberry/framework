import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { StakingService } from "./staking.service";
import { StakingCreateDto, StakingSearchDto } from "./dto";
import { StakingEntity } from "./staking.entity";

@ApiBearerAuth()
@Controller("/staking")
export class StakingController {
  constructor(private readonly stakingService: StakingService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: StakingSearchDto): Promise<[Array<StakingEntity>, number]> {
    return this.stakingService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<StakingEntity | null> {
    return this.stakingService.findOne({ id });
  }

  @Post("/")
  public create(@Body() dto: StakingCreateDto): Promise<StakingEntity> {
    return this.stakingService.create(dto);
  }
}
