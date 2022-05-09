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
import { Erc721RecipeEntity } from "./recipe.entity";
import { Erc721RecipeCreateDto, Erc721RecipeSearchDto, Erc721RecipeUpdateDto } from "./dto";

@Public()
@Controller("/erc721-recipes")
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721RecipeSearchDto): Promise<[Array<Erc721RecipeEntity>, number]> {
    return this.recipeService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc721RecipeEntity | null> {
    return this.recipeService.findOne(
      { id },
      {
        join: {
          alias: "recipe",
          leftJoinAndSelect: {
            erc721Token: "erc721.erc721Token",
            ingredients: "erc721.ingredients",
          },
        },
      },
    );
  }

  @Post("/")
  public create(@Body() dto: Erc721RecipeCreateDto): Promise<Erc721RecipeEntity> {
    return this.recipeService.create(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc721RecipeUpdateDto,
  ): Promise<Erc721RecipeEntity> {
    return this.recipeService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.recipeService.delete({ id });
  }
}
