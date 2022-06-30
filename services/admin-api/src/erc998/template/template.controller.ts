import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc998TemplateService } from "./template.service";
import {
  Erc998TemplateAutocompleteDto,
  Erc998TemplateCreateDto,
  Erc998TemplateSearchDto,
  Erc998TemplateUpdateDto,
} from "./dto";
import { UniTemplateEntity } from "../../blockchain/uni-token/uni-template/uni-template.entity";

@ApiBearerAuth()
@Controller("/erc998-templates")
export class Erc998TemplateController {
  constructor(private readonly erc998TemplateService: Erc998TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc998TemplateSearchDto): Promise<[Array<UniTemplateEntity>, number]> {
    return this.erc998TemplateService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: Erc998TemplateAutocompleteDto): Promise<Array<UniTemplateEntity>> {
    return this.erc998TemplateService.autocomplete(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc998TemplateUpdateDto,
  ): Promise<UniTemplateEntity> {
    return this.erc998TemplateService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UniTemplateEntity | null> {
    return this.erc998TemplateService.findOne({ id });
  }

  @Post("/")
  public create(@Body() dto: Erc998TemplateCreateDto): Promise<UniTemplateEntity> {
    return this.erc998TemplateService.create(dto);
  }

  @Delete("/:id")
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<UniTemplateEntity> {
    return this.erc998TemplateService.delete({ id });
  }
}
