import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { Erc998TemplateService } from "./template.service";
import { Erc998TemplateEntity } from "./template.entity";
import { Erc998TemplateSearchDto } from "./dto";

@Public()
@Controller("/erc998-templates")
export class Erc998TemplateController {
  constructor(private readonly erc998TemplateService: Erc998TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc998TemplateSearchDto): Promise<[Array<Erc998TemplateEntity>, number]> {
    return this.erc998TemplateService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<Erc998TemplateEntity>> {
    return this.erc998TemplateService.autocomplete();
  }

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(): Promise<[Array<Erc998TemplateEntity>, number]> {
    return this.erc998TemplateService.getNewTemplates();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc998TemplateEntity | null> {
    return this.erc998TemplateService.findOne({ id }, { relations: ["erc998Collection"] });
  }
}
