import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc721TemplateService } from "./template.service";
import {
  Erc721TemplateAutocompleteDto,
  Erc721TemplateCreateDto,
  Erc721TemplateSearchDto,
  Erc721TemplateUpdateDto,
} from "./dto";
import { UniTemplateEntity } from "../../blockchain/uni-token/uni-template.entity";

@ApiBearerAuth()
@Controller("/erc721-templates")
export class Erc721TemplateController {
  constructor(private readonly erc721TemplateService: Erc721TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721TemplateSearchDto): Promise<[Array<UniTemplateEntity>, number]> {
    return this.erc721TemplateService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: Erc721TemplateAutocompleteDto): Promise<Array<UniTemplateEntity>> {
    return this.erc721TemplateService.autocomplete(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc721TemplateUpdateDto,
  ): Promise<UniTemplateEntity> {
    return this.erc721TemplateService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UniTemplateEntity | null> {
    return this.erc721TemplateService.findOne({ id });
  }

  @Post("/")
  public create(@Body() dto: Erc721TemplateCreateDto): Promise<UniTemplateEntity> {
    return this.erc721TemplateService.create(dto);
  }

  @Delete("/:id")
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<UniTemplateEntity> {
    return this.erc721TemplateService.delete({ id });
  }
}
