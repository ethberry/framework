import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseInterceptors} from "@nestjs/common";
import {ApiCookieAuth} from "@nestjs/swagger";

import {NotFoundInterceptor, PaginationInterceptor} from "@gemunionstudio/nest-js-providers";

import {ProductService} from "./product.service";
import {ProductEntity} from "./product.entity";
import {ProductCreateDto, ProductSearchDto, ProductUpdateDto} from "./dto";
import {UserEntity} from "../user/user.entity";
import {User} from "../common/decorators";

@ApiCookieAuth()
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
    @Query() query: ProductSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ProductEntity>, number]> {
    return this.productService.search(query, userEntity);
  }

  @Post("/")
  public create(@Body() body: ProductCreateDto, @User() userEntity: UserEntity): Promise<ProductEntity> {
    return this.productService.create(body, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id") id: number,
    @Body() body: ProductUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<ProductEntity> {
    return this.productService.update({id}, body, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: number): Promise<ProductEntity | undefined> {
    return this.productService.findOne({id});
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id") id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.productService.delete({id}, userEntity);
  }
}
