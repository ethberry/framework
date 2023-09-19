import { Controller, Get, UseInterceptors } from "@nestjs/common";

import { PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { ProductPromoService } from "./promo.service";
import { ProductPromoEntity } from "./promo.entity";

@Public()
@Controller("/ecommerce/promos")
export class ProductPromoController {
  constructor(private readonly productPromoService: ProductPromoService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(): Promise<[Array<ProductPromoEntity>, number]> {
    return this.productPromoService.findAndCount({});
  }
}
