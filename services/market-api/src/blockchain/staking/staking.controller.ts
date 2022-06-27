import { ClassSerializerInterceptor, Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { StakingService } from "./staking.service";
import { StakingEntity } from "./staking.entity";
import { StakingSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/staking")
export class StakingController {
  constructor(private readonly stakingService: StakingService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  public search(@Query() dto: StakingSearchDto): Promise<[Array<StakingEntity>, number]> {
    return this.stakingService.search(dto);
  }
}
