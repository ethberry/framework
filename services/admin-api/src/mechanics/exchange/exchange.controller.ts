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

import { ExchangeService } from "./exchange.service";
import { ExchangeEntity } from "./exchange.entity";
import { Erc721RecipeSearchDto, Erc721RecipeUpdateDto, ExchangeCreateDto } from "./dto";

@Public()
@Controller("/erc721-recipes")
export class ExchangeController {
  constructor(private readonly recipeService: ExchangeService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721RecipeSearchDto): Promise<[Array<ExchangeEntity>, number]> {
    return this.recipeService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ExchangeEntity | null> {
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
  public create(@Body() dto: ExchangeCreateDto): Promise<ExchangeEntity> {
    return this.recipeService.create(dto);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: Erc721RecipeUpdateDto): Promise<ExchangeEntity> {
    return this.recipeService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.recipeService.delete({ id });
  }
}
