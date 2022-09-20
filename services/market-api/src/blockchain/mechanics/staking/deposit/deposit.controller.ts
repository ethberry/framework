import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { StakingDepositEntity } from "./deposit.entity";
import { StakingDepositService } from "./deposit.service";
import { StakingDepositSearchDto } from "./dto";
import { UserEntity } from "../../../../user/user.entity";

@ApiBearerAuth()
@Controller("/staking/stakes")
export class StakingDepositController {
  constructor(private readonly stakesService: StakingDepositService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: StakingDepositSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<StakingDepositEntity>, number]> {
    return this.stakesService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Param("id", ParseIntPipe) id: number,
    @User() userEntity: UserEntity,
  ): Promise<StakingDepositEntity | null> {
    return this.stakesService.findOneWithRelations({ id, account: userEntity.wallet });
  }
}
