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

import { Erc1155TokenService } from "./token.service";
import { Erc1155TokenEntity } from "./token.entity";
import {
  Erc1155TokenAutocompleteDto,
  Erc1155TokenCreateDto,
  Erc1155TokenSearchDto,
  Erc1155TokenUpdateDto,
} from "./dto";

@ApiBearerAuth()
@Controller("/erc1155-tokens")
export class Erc1155TokenController {
  constructor(private readonly erc1155TokenService: Erc1155TokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc1155TokenSearchDto): Promise<[Array<Erc1155TokenEntity>, number]> {
    return this.erc1155TokenService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: Erc1155TokenAutocompleteDto): Promise<Array<Erc1155TokenEntity>> {
    return this.erc1155TokenService.autocomplete(dto);
  }

  @Post("/")
  public create(@Body() dto: Erc1155TokenCreateDto): Promise<Erc1155TokenEntity> {
    return this.erc1155TokenService.create(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc1155TokenUpdateDto,
  ): Promise<Erc1155TokenEntity> {
    return this.erc1155TokenService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc1155TokenEntity | null> {
    return this.erc1155TokenService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.erc1155TokenService.delete({ id });
  }
}
