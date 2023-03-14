import { Controller, Get, Param, Query, UseInterceptors } from "@nestjs/common";
import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { ProductService } from "./product.service";
import { ProductEntity } from "./product.entity";
import { ProductSearchDto } from "./dto";

@Public()
@Controller("/products")
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: ProductSearchDto): Promise<[Array<ProductEntity>, number]> {
    return this.productsService.search(dto);
  }

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewProducts(): Promise<[Array<ProductEntity>, number]> {
    return this.productsService.getNewProducts();
  }

  @Get("/popular")
  @UseInterceptors(PaginationInterceptor)
  public getPopularProducts(): Promise<[Array<ProductEntity>, number]> {
    return this.productsService.getPopularProducts();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: number): Promise<ProductEntity | null> {
    return this.productsService.findOneWithRelations({ id });
  }
}
