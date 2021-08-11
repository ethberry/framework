import {Controller, Get, UseInterceptors} from "@nestjs/common";

import {PaginationInterceptor, Public} from "@gemunionstudio/nest-js-utils";

import {PromoService} from "./promo.service";
import {PromoEntity} from "./promo.entity";

@Public()
@Controller("/promo")
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(): Promise<[Array<PromoEntity>, number]> {
    return this.promoService.findAndCount({});
  }
}
