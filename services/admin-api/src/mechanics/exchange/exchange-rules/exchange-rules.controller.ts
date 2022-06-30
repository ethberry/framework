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

import { ExchangeRulesService } from "./exchange-rules.service";
import { ExchangeRulesEntity } from "./exchange-rules.entity";
import { Erc721RecipeSearchDto, Erc721RecipeUpdateDto, ExchangeCreateDto } from "./dto";

@Public()
@Controller("/exchange-rules")
export class ExchangeRulesController {
  constructor(private readonly recipeService: ExchangeRulesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721RecipeSearchDto): Promise<[Array<ExchangeRulesEntity>, number]> {
    return this.recipeService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ExchangeRulesEntity | null> {
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
  public create(@Body() dto: ExchangeCreateDto): Promise<ExchangeRulesEntity> {
    return this.recipeService.create(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc721RecipeUpdateDto,
  ): Promise<ExchangeRulesEntity> {
    return this.recipeService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.recipeService.delete({ id });
  }
}
