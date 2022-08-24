import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";
import { SearchDto } from "@gemunion/collection";
import type { IServerSignature } from "@gemunion/types-collection";

import { SignCraftDto } from "./dto";
import { CraftService } from "./craft.service";
import { CraftEntity } from "./craft.entity";
import { UserEntity } from "../../../user/user.entity";

@Public()
@Controller("/craft")
export class CraftController {
  constructor(private readonly craftService: CraftService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: SearchDto): Promise<[Array<CraftEntity>, number]> {
    return this.craftService.search(dto);
  }

  @Post("/sign")
  public sign(@Body() dto: SignCraftDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.craftService.sign(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<CraftEntity | null> {
    return this.craftService.findOneWithRelations({ id });
  }
}
