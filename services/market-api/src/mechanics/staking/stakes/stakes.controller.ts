import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

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

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Param("id", ParseIntPipe) id: number,
    @User() userEntity: UserEntity,
  ): Promise<StakingStakesEntity | null> {
    return this.stakesService.findOneWithRelations({ id, account: userEntity.wallet });
  }
}
