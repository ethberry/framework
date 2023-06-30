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
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { ProductItemService } from "./product-item.service";
import { ProductItemEntity } from "./product-item.entity";
import { ProductItemCreateDto, ProductItemSearchDto, ProductItemUpdateDto } from "./dto";
import { UserEntity } from "../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/product-item")
export class ProductItemController {
  constructor(private readonly productItemService: ProductItemService) {}

  @Get("/autocomplete")
  public autocomplete(@User() userEntity: UserEntity): Promise<Array<ProductItemEntity>> {
    return this.productItemService.autocomplete(userEntity);
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
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: ProductItemUpdateDto): Promise<ProductItemEntity> {
    return this.productItemService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ProductItemEntity | null> {
    return this.productItemService.findOneWithRelations({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.productItemService.delete({ id });
  }
}
