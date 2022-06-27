import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";
import { SearchDto } from "@gemunion/collection";

import { ExchangeService } from "./exchange.service";
import { ExchangeEntity } from "./exchange.entity";

@Public()
@Controller("/erc1155-recipes")
export class ExchangeController {
  constructor(private readonly recipeService: ExchangeService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: SearchDto): Promise<[Array<ExchangeEntity>, number]> {
    return this.recipeService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ExchangeEntity | null> {
    return this.recipeService.findOne({ id });
  }
}
