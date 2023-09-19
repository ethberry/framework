import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { PonziDepositEntity } from "./deposit.entity";
import { PonziDepositService } from "./deposit.service";
import { PonziDepositSearchDto } from "./dto";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/ponzi/stakes")
export class PonziDepositController {
  constructor(private readonly stakesService: PonziDepositService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: PonziDepositSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<PonziDepositEntity>, number]> {
    return this.stakesService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Param("id", ParseIntPipe) id: number,
    @User() userEntity: UserEntity,
  ): Promise<PonziDepositEntity | null> {
    return this.stakesService.findOneWithRelations({ id, account: userEntity.wallet });
  }
}
