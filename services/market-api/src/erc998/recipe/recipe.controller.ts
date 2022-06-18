import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";
import { SearchDto } from "@gemunion/collection";

import { RecipeService } from "./recipe.service";
import { Erc998RecipeEntity } from "./recipe.entity";

@Public()
@Controller("/erc998-recipes")
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: SearchDto): Promise<[Array<Erc998RecipeEntity>, number]> {
    return this.recipeService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc998RecipeEntity | null> {
    return this.recipeService.findOne({ id });
  }
}
