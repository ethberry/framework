import { Controller, Get, Param, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AddressPipe, ApiAddress, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { StakingStakesEntity } from "./staking-stakes.entity";
import { StakingStakesService } from "./staking-stakes.service";
import { StakesSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/staking/stakes")
export class StakingStakesController {
  constructor(private readonly stakesService: StakingStakesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: StakesSearchDto): Promise<[Array<StakingStakesEntity>, number]> {
    return this.stakesService.search(dto);
  }

  @ApiAddress("address")
  @Get("/:address")
  public findOne(@Param("address", AddressPipe) account: string): Promise<Array<StakingStakesEntity>> {
    return this.stakesService.findAll({ account });
  }
}
