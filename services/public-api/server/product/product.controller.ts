import {Controller, Get, Param, Query, UseInterceptors} from "@nestjs/common";
import {NotFoundInterceptor, PaginationInterceptor, Public} from "@trejgun/nest-js-providers";

import {ProductService} from "./product.service";
import {ProductEntity} from "./product.entity";
import {ProductSortDto} from "./dto";

@Public()
@Controller("/products")
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() query: ProductSortDto): Promise<[Array<ProductEntity>, number]> {
    return this.productsService.search(query);
  }

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewProducts(): Promise<[Array<ProductEntity>, number]> {
    return this.productsService.getNewProducts();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: number): Promise<ProductEntity | undefined> {
    return this.productsService.findOne({id}, {relations: ["photos"]});
  }
}
