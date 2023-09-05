import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { TemplateNewDto } from "../../../hierarchy/template/dto";
import { MysteryBoxSearchDto } from "./dto";
import { MysteryBoxService } from "./box.service";
import { MysteryBoxEntity } from "./box.entity";

@Public()
@Controller("/mystery/boxes")
export class MysteryBoxController {
  constructor(private readonly mysteryBoxService: MysteryBoxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: MysteryBoxSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<MysteryBoxEntity>, number]> {
    return this.mysteryBoxService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<MysteryBoxEntity>> {
    return this.mysteryBoxService.autocomplete();
  }

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(
    @Query() dto: TemplateNewDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<MysteryBoxEntity>, number]> {
    return this.mysteryBoxService.search({ take: 10 }, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<MysteryBoxEntity | null> {
    return this.mysteryBoxService.findOneWithRelations({ id });
  }
}
