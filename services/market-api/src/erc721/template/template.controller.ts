import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { Erc721TemplateService } from "./template.service";
import { Erc721TemplateSearchDto } from "./dto";
import { UniTemplateEntity } from "../../uni-token/uni-template.entity";

@Public()
@Controller("/erc721-templates")
export class Erc721TemplateController {
  constructor(private readonly erc721TemplateService: Erc721TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721TemplateSearchDto): Promise<[Array<UniTemplateEntity>, number]> {
    return this.erc721TemplateService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<UniTemplateEntity>> {
    return this.erc721TemplateService.autocomplete();
  }

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(): Promise<[Array<UniTemplateEntity>, number]> {
    return this.erc721TemplateService.getNewTemplates();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UniTemplateEntity | null> {
    return this.erc721TemplateService.findOne({ id }, { relations: ["erc721Collection"] });
  }
}
