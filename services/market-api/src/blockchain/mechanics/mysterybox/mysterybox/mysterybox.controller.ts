import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";

import { MysteryboxSearchDto } from "./dto";
import { MysteryboxBoxService } from "./mysterybox.service";
import { MysteryboxEntity } from "./mysterybox.entity";
import { UserEntity } from "../../../../user/user.entity";
import { TemplateNewDto } from "../../../hierarchy/template/dto/new";

@Public()
@Controller("/mysteryboxes")
export class MysteryboxBoxController {
  constructor(private readonly mysteryboxBoxService: MysteryboxBoxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: MysteryboxSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<MysteryboxEntity>, number]> {
    return this.mysteryboxBoxService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<MysteryboxEntity>> {
    return this.mysteryboxBoxService.autocomplete();
  }

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(
    @Query() dto: TemplateNewDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<MysteryboxEntity>, number]> {
    return this.mysteryboxBoxService.search({ take: 10 }, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<MysteryboxEntity | null> {
    return this.mysteryboxBoxService.findOneWithRelations({ id });
  }
}
