import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";

import { TemplateService } from "./template.service";
import { TemplateEntity } from "./template.entity";
import { TemplateNewDto } from "./dto/new";
import { UserEntity } from "../../../user/user.entity";
import { ModuleType } from "@framework/types";

@Public()
@Controller("/templates")
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(
    @Query() dto: TemplateNewDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    return this.templateService.search({ take: 10 }, userEntity, dto.contractType, ModuleType.CORE);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.templateService.findOneWithRelations({ id });
  }
}
