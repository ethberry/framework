import { Body, Post, Controller, Delete, Get, Param, ParseIntPipe, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc20TokenService } from "./token.service";
import { Erc20TokenEntity } from "./token.entity";
import { Erc20TokenSearchDto, Erc20TokenUpdateDto, Erc20TokenCreateDto, Erc20TokenAutocompleteDto } from "./dto";

@ApiBearerAuth()
@Controller("/erc20-tokens")
export class Erc20TokenController {
  constructor(private readonly erc20TokenService: Erc20TokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc20TokenSearchDto): Promise<[Array<Erc20TokenEntity>, number]> {
    return this.erc20TokenService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: Erc20TokenCreateDto): Promise<Erc20TokenEntity> {
    return this.erc20TokenService.create(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: Erc20TokenAutocompleteDto): Promise<Array<Erc20TokenEntity>> {
    return this.erc20TokenService.autocomplete(dto);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: Erc20TokenUpdateDto): Promise<Erc20TokenEntity> {
    return this.erc20TokenService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc20TokenEntity | null> {
    return this.erc20TokenService.findOne({ id });
  }

  @Delete("/:id")
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<Erc20TokenEntity> {
    return this.erc20TokenService.delete({ id });
  }
}
