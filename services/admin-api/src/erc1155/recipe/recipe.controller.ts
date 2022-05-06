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
import { Erc1155RecipeEntity } from "./recipe.entity";
import { Erc1155RecipeCreateDto, Erc1155RecipeSearchDto, Erc1155RecipeUpdateDto } from "./dto";

@Public()
@Controller("/erc1155-recipes")
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc1155RecipeSearchDto): Promise<[Array<Erc1155RecipeEntity>, number]> {
    return this.recipeService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc1155RecipeEntity | null> {
    return this.recipeService.findOne(
      { id },
      {
        join: {
          alias: "recipe",
          leftJoinAndSelect: {
            erc1155Token: "erc1155.erc1155Token",
            ingredients: "erc1155.ingredients",
          },
        },
      },
    );
  }

  @Post("/")
  public create(@Body() dto: Erc1155RecipeCreateDto): Promise<Erc1155RecipeEntity> {
    return this.recipeService.create(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc1155RecipeUpdateDto,
  ): Promise<Erc1155RecipeEntity> {
    return this.recipeService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.recipeService.delete({ id });
  }
}
