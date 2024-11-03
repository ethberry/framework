import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@ethberry/nest-js-utils";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { VestingBoxSearchDto } from "./dto";
import { VestingBoxService } from "./box.service";
import { VestingBoxEntity } from "./box.entity";

@ApiBearerAuth()
@Controller("/vesting/boxes")
export class VestingBoxController {
  constructor(private readonly vestingBoxService: VestingBoxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public searchContracts(
    @Query() dto: VestingBoxSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<VestingBoxEntity>, number]> {
    return this.vestingBoxService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<VestingBoxEntity | null> {
    return this.vestingBoxService.findOneWithRelations({ id });
  }
}
