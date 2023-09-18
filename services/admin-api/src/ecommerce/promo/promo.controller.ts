import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";

import { PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { ProductPromoService } from "./promo.service";
import { ProductPromoEntity } from "./promo.entity";
import { ProductPromoCreateDto, ProductPromoSearchDto, ProductPromoUpdateDto } from "./dto";

@Public()
@Controller("/ecommerce/promos")
export class PromoController {
  constructor(private readonly productPromoService: ProductPromoService) {}

  @Public()
  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: ProductPromoSearchDto): Promise<[Array<ProductPromoEntity>, number]> {
    return this.productPromoService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: ProductPromoCreateDto): Promise<ProductPromoEntity> {
    return this.productPromoService.create(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: ProductPromoUpdateDto,
  ): Promise<ProductPromoEntity | undefined> {
    return this.productPromoService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.productPromoService.delete({ id });
  }
}
