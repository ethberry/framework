import { Controller, Get, Param, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AddressPipe, ApiAddress, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { StakingStakesEntity } from "./stakes.entity";
import { StakingStakesService } from "./stakes.service";
import { StakesSearchDto } from "./dto";
import { UserEntity } from "../../../user/user.entity";

@ApiBearerAuth()
@Controller("/staking/stakes")
export class StakingStakesController {
  constructor(private readonly stakesService: StakingStakesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: StakesSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<StakingStakesEntity>, number]> {
    return this.stakesService.search(dto, userEntity);
  }

  @ApiAddress("address")
  @Get("/:address")
  public findOne(@Param("address", AddressPipe) account: string): Promise<Array<StakingStakesEntity>> {
    return this.stakesService.findAll({ account });
  }
}
