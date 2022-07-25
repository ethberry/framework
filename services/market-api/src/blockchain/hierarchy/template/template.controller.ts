import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { TemplateService } from "./template.service";
import { TemplateEntity } from "./template.entity";
import { TemplateNewDto } from "./dto/new";

@Public()
@Controller("/templates")
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(@Query() dto: TemplateNewDto): Promise<[Array<TemplateEntity>, number]> {
    return this.templateService.search({ take: 10 }, dto.contractType);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.templateService.findOneWithRelations({ id });
  }
}
