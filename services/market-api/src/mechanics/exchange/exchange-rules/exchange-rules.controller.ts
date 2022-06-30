import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";
import { SearchDto } from "@gemunion/collection";

import { ExchangeRulesService } from "./exchange-rules.service";
import { ExchangeRulesEntity } from "./exchange-rules.entity";

@Public()
@Controller("/erc1155-recipes")
export class ExchangeRulesController {
  constructor(private readonly recipeService: ExchangeRulesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: SearchDto): Promise<[Array<ExchangeRulesEntity>, number]> {
    return this.recipeService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ExchangeRulesEntity | null> {
    return this.recipeService.findOne({ id });
  }
}
