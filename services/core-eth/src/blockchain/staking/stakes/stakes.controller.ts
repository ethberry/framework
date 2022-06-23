import { Controller, Get, Param, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AddressPipe, ApiAddress, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { StakesEntity } from "./stakes.entity";
import { StakesService } from "./stakes.service";
import { StakesSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/access-control")
export class StakesController {
  constructor(private readonly stakesService: StakesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: StakesSearchDto): Promise<[Array<StakesEntity>, number]> {
    return this.stakesService.search(dto);
  }

  @ApiAddress("address")
  @Get("/:address")
  public findOne(@Param("address", AddressPipe) owner: string): Promise<Array<StakesEntity>> {
    return this.stakesService.findAll({ owner });
  }
}
