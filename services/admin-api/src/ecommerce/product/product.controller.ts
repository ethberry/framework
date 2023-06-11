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

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { ProductService } from "./product.service";
import { ProductEntity } from "./product.entity";
import { ProductCreateDto, ProductSearchDto, ProductUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/ecommerce/products")
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
  public findOne(@Param("id") id: number): Promise<ProductEntity | null> {
    return this.productService.findOneWithRelations({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id") id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.productService.delete({ id }, userEntity);
  }
}
