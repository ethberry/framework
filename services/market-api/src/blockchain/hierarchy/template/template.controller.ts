import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";

import { PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { TemplateService } from "./template.service";
import { TemplateSearchDto } from "./dto";
import { TemplateEntity } from "./template.entity";
import { TemplateNewDto } from "./dto/new";

@Public()
@Controller("/uni-templates")
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TemplateSearchDto): Promise<[Array<TemplateEntity>, number]> {
    return this.templateService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<TemplateEntity>> {
    return this.templateService.autocomplete();
  }

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(@Query() dto: TemplateNewDto): Promise<[Array<TemplateEntity>, number]> {
    return this.templateService.getNewTemplates(dto);
  }
}
