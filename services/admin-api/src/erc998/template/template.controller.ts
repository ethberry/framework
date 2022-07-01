import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc998TemplateService } from "./template.service";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";
import {
  TemplateAutocompleteDto,
  TemplateCreateDto,
  TemplateSearchDto,
  TemplateUpdateDto,
} from "../../blockchain/hierarchy/template/dto";

@ApiBearerAuth()
@Controller("/erc998-templates")
export class Erc998TemplateController {
  constructor(private readonly erc998TemplateService: Erc998TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TemplateSearchDto): Promise<[Array<TemplateEntity>, number]> {
    return this.erc998TemplateService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: TemplateAutocompleteDto): Promise<Array<TemplateEntity>> {
    return this.erc998TemplateService.autocomplete(dto);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: TemplateUpdateDto): Promise<TemplateEntity> {
    return this.erc998TemplateService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.erc998TemplateService.findOne({ id });
  }

  @Post("/")
  public create(@Body() dto: TemplateCreateDto): Promise<TemplateEntity> {
    return this.erc998TemplateService.create(dto);
  }

  @Delete("/:id")
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity> {
    return this.erc998TemplateService.delete({ id });
  }
}
