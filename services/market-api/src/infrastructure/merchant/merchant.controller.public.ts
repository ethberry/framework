import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";
import { SearchDto } from "@gemunion/collection";

import { MerchantService } from "./merchant.service";
import { MerchantEntity } from "./merchant.entity";

@Public()
@Controller("/merchants")
export class MerchantControllerPublic {
  constructor(private readonly merchantService: MerchantService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: SearchDto): Promise<[Array<MerchantEntity>, number]> {
    return this.merchantService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<MerchantEntity>> {
    return this.merchantService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<MerchantEntity | null> {
    return this.merchantService.findOne({ id });
  }
}
