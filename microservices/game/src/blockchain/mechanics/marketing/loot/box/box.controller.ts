import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@ethberry/nest-js-utils";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { TemplateNewDto } from "../../../../hierarchy/template/dto";
import { LootBoxSearchDto } from "./dto";
import { LootBoxService } from "./box.service";
import { LootBoxEntity } from "./box.entity";

@Public()
@Controller("/loot/boxes")
export class LootBoxController {
  constructor(private readonly lootBoxService: LootBoxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: LootBoxSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<LootBoxEntity>, number]> {
    return this.lootBoxService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<LootBoxEntity>> {
    return this.lootBoxService.autocomplete();
  }

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(
    @Query() dto: TemplateNewDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<LootBoxEntity>, number]> {
    return this.lootBoxService.search({ take: 10 }, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<LootBoxEntity | null> {
    return this.lootBoxService.findOneWithRelations({ id });
  }
}
