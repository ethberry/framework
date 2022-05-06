import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";
import { SearchDto } from "@gemunion/collection";

import { RecipeService } from "./recipe.service";
import { Erc1155RecipeEntity } from "./recipe.entity";

@Public()
@Controller("/erc1155-recipes")
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: SearchDto): Promise<[Array<Erc1155RecipeEntity>, number]> {
    return this.recipeService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc1155RecipeEntity | null> {
    return this.recipeService.findOne({ id });
  }

  // @Get("/:id/ingredients")
  // @UseInterceptors(NotFoundInterceptor)
  // public findIngredients(@Param("id", ParseIntPipe) id: number): Promise<Erc1155RecipeEntity | null> {
  //   return this.recipeService.findIngredients({ id });
  // }
}
