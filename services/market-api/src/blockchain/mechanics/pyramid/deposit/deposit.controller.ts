import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { PyramidDepositEntity } from "./deposit.entity";
import { PyramidDepositService } from "./deposit.service";
import { PyramidDepositSearchDto } from "./dto";
import { UserEntity } from "../../../../user/user.entity";

@ApiBearerAuth()
@Controller("/pyramid/stakes")
export class PyramidDepositController {
  constructor(private readonly stakesService: PyramidDepositService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: PyramidDepositSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<PyramidDepositEntity>, number]> {
    return this.stakesService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Param("id", ParseIntPipe) id: number,
    @User() userEntity: UserEntity,
  ): Promise<PyramidDepositEntity | null> {
    return this.stakesService.findOneWithRelations({ id, account: userEntity.wallet });
  }
}
