import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc1155TemplateService } from "./template.service";
import {
  Erc1155TemplateAutocompleteDto,
  Erc1155TemplateSearchDto,
  Erc1155TemplateUpdateDto,
  Erc1155TokenCreateDto,
} from "./dto";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";

@ApiBearerAuth()
@Controller("/erc1155-templates")
export class Erc1155TemplateController {
  constructor(private readonly erc1155TemplateService: Erc1155TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc1155TemplateSearchDto): Promise<[Array<TemplateEntity>, number]> {
    return this.erc1155TemplateService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: Erc1155TemplateAutocompleteDto): Promise<Array<TemplateEntity>> {
    return this.erc1155TemplateService.autocomplete(dto);
  }

  @Post("/")
  public create(@Body() dto: Erc1155TokenCreateDto): Promise<TemplateEntity> {
    return this.erc1155TemplateService.create(dto);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: Erc1155TemplateUpdateDto): Promise<TemplateEntity> {
    return this.erc1155TemplateService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.erc1155TemplateService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.erc1155TemplateService.delete({ id });
  }
}
