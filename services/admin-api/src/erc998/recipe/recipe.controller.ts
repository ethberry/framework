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

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { RecipeService } from "./recipe.service";
import { Erc998RecipeEntity } from "./recipe.entity";
import { Erc998RecipeCreateDto, Erc998RecipeSearchDto, Erc998RecipeUpdateDto } from "./dto";

@Public()
@Controller("/erc998-recipes")
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc998RecipeSearchDto): Promise<[Array<Erc998RecipeEntity>, number]> {
    return this.recipeService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc998RecipeEntity | null> {
    return this.recipeService.findOne(
      { id },
      {
        join: {
          alias: "recipe",
          leftJoinAndSelect: {
            erc998Token: "erc998.erc998Token",
            ingredients: "erc998.ingredients",
          },
        },
      },
    );
  }

  @Post("/")
  public create(@Body() dto: Erc998RecipeCreateDto): Promise<Erc998RecipeEntity> {
    return this.recipeService.create(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc998RecipeUpdateDto,
  ): Promise<Erc998RecipeEntity> {
    return this.recipeService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.recipeService.delete({ id });
  }
}
