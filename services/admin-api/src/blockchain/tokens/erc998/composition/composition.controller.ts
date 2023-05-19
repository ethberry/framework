import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { Erc998CompositionService } from "./composition.service";
import { CompositionEntity } from "./composition.entity";
import { CompositionSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/erc998/composition")
export class Erc998CompositionController {
  constructor(private readonly erc998CompositionService: Erc998CompositionService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: CompositionSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<CompositionEntity>, number]> {
    return this.erc998CompositionService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<CompositionEntity | null> {
    return this.erc998CompositionService.findOne({ id }, { relations: { parent: true, child: true } });
  }
}
