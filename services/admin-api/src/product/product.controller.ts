import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { ProductService } from "./product.service";
import { ProductEntity } from "./product.entity";
import { ProductCreateDto, ProductSearchDto, ProductUpdateDto } from "./dto";
import { UserEntity } from "../user/user.entity";

@ApiBearerAuth()
@Controller("/products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get("/autocomplete")
  public autocomplete(@User() userEntity: UserEntity): Promise<Array<ProductEntity>> {
    return this.productService.autocomplete(userEntity);
  }

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ProductSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ProductEntity>, number]> {
    return this.productService.search(dto, userEntity);
  }

  @Post("/")
  public create(@Body() dto: ProductCreateDto, @User() userEntity: UserEntity): Promise<ProductEntity> {
    return this.productService.create(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id") id: number,
    @Body() dto: ProductUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<ProductEntity> {
    return this.productService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: number): Promise<ProductEntity | undefined> {
    return this.productService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id") id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.productService.delete({ id }, userEntity);
  }
}
