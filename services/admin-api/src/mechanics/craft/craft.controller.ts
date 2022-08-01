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

import { CraftService } from "./craft.service";
import { CraftEntity } from "./craft.entity";
import { Erc721RecipeSearchDto, Erc721RecipeUpdateDto, ExchangeCreateDto } from "./dto";

@Public()
@Controller("/craft")
export class CraftController {
  constructor(private readonly recipeService: CraftService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721RecipeSearchDto): Promise<[Array<CraftEntity>, number]> {
    return this.recipeService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<CraftEntity | null> {
    return this.recipeService.findOne(
      { id },
      {
        join: {
          alias: "craft",
          leftJoinAndSelect: {
            item: "craft.item",
            item_components: "item.components",
            item_template: "item_components.template",
            item_contract: "item_components.contract",
            price: "craft.price",
            price_components: "price.components",
            price_template: "price_components.template",
            price_contract: "price_components.contract",
          },
        },
      },
    );
  }

  @Post("/")
  public create(@Body() dto: ExchangeCreateDto): Promise<CraftEntity> {
    return this.recipeService.create(dto);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: Erc721RecipeUpdateDto): Promise<CraftEntity> {
    return this.recipeService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.recipeService.delete({ id });
  }
}
