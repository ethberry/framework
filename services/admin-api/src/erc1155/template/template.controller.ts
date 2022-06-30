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
  Erc1155TokenCreateDto,
  Erc1155TemplateSearchDto,
  Erc1155TemplateUpdateDto,
} from "./dto";
import { UniTemplateEntity } from "../../blockchain/uni-token/uni-template/uni-template.entity";

@ApiBearerAuth()
@Controller("/erc1155-tokens")
export class Erc1155TokenController {
  constructor(private readonly erc1155TokenService: Erc1155TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc1155TemplateSearchDto): Promise<[Array<UniTemplateEntity>, number]> {
    return this.erc1155TokenService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: Erc1155TemplateAutocompleteDto): Promise<Array<UniTemplateEntity>> {
    return this.erc1155TokenService.autocomplete(dto);
  }

  @Post("/")
  public create(@Body() dto: Erc1155TokenCreateDto): Promise<UniTemplateEntity> {
    return this.erc1155TokenService.create(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc1155TemplateUpdateDto,
  ): Promise<UniTemplateEntity> {
    return this.erc1155TokenService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UniTemplateEntity | null> {
    return this.erc1155TokenService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.erc1155TokenService.delete({ id });
  }
}
