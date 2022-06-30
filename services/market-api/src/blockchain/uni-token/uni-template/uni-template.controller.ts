import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";

import { PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { UniTemplateService } from "./uni-template.service";
import { UniTemplateSearchDto } from "./dto";
import { UniTemplateEntity } from "./uni-template.entity";
import { TemplateNewDto } from "./dto/new";

@Public()
@Controller("/uni-templates")
export class UniTemplateController {
  constructor(private readonly uniTemplateService: UniTemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: UniTemplateSearchDto): Promise<[Array<UniTemplateEntity>, number]> {
    return this.uniTemplateService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<UniTemplateEntity>> {
    return this.uniTemplateService.autocomplete();
  }

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(@Query() dto: TemplateNewDto): Promise<[Array<UniTemplateEntity>, number]> {
    return this.uniTemplateService.getNewTemplates(dto);
  }
}
