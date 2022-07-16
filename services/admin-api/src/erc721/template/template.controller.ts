import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc721TemplateService } from "./template.service";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";
import { TemplateCreateDto, TemplateSearchDto, TemplateUpdateDto } from "../../blockchain/hierarchy/template/dto";

@ApiBearerAuth()
@Controller("/erc721-templates")
@UseInterceptors(ClassSerializerInterceptor)
export class Erc721TemplateController {
  constructor(private readonly erc721TemplateService: Erc721TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TemplateSearchDto): Promise<[Array<TemplateEntity>, number]> {
    return this.erc721TemplateService.search(dto);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: TemplateUpdateDto): Promise<TemplateEntity> {
    return this.erc721TemplateService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.erc721TemplateService.findOne(
      { id },
      {
        join: {
          alias: "template",
          leftJoinAndSelect: {
            price: "template.price",
            components: "price.components",
          },
        },
      },
    );
  }

  @Post("/")
  public create(@Body() dto: TemplateCreateDto): Promise<TemplateEntity> {
    return this.erc721TemplateService.createTemplate(dto);
  }

  @Delete("/:id")
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity> {
    return this.erc721TemplateService.delete({ id });
  }
}
