import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { ProductItemService } from "./product-item.service";
import { ProductItemEntity } from "./product-item.entity";
import { ProductItemCreateDto, ProductItemSearchDto, ProductItemUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/ecommerce/product-item")
export class ProductItemController {
  constructor(private readonly productItemService: ProductItemService) {}

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<ProductItemEntity>> {
    return this.productItemService.autocomplete();
  }

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: ProductItemSearchDto): Promise<[Array<ProductItemEntity>, number]> {
    return this.productItemService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: ProductItemCreateDto): Promise<ProductItemEntity> {
    return this.productItemService.create(dto);
  }

  @Put("/:id")
  public update(@Param("id") id: number, @Body() dto: ProductItemUpdateDto): Promise<ProductItemEntity> {
    return this.productItemService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: number): Promise<ProductItemEntity | null> {
    return this.productItemService.findOneWithRelations({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id") id: number): Promise<void> {
    await this.productItemService.delete({ id });
  }
}
