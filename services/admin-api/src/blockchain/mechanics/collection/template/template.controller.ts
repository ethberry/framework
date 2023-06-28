import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { CollectionTemplateService } from "./template.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateSearchDto, TemplateUpdateDto } from "../../../hierarchy/template/dto";

@ApiBearerAuth()
@Controller("/collection/templates")
export class Erc721CollectionController {
  constructor(private readonly erc721CollectionService: CollectionTemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: TemplateSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    return this.erc721CollectionService.search(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: TemplateUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<TemplateEntity> {
    return this.erc721CollectionService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.erc721CollectionService.findOneWithRelations({ id });
  }
}
