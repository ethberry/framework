import {Controller, Get, Param, Query, UseInterceptors} from "@nestjs/common";

import {NotFoundInterceptor, PaginationInterceptor, Public} from "@trejgun/nest-js-providers";

import {MerchantService} from "./merchant.service";
import {MerchantEntity} from "./merchant.entity";
import {MerchantSearchSchema} from "./schemas";

@Public()
@Controller("/merchants")
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() query: MerchantSearchSchema): Promise<[Array<MerchantEntity>, number]> {
    return this.merchantService.search(query);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<MerchantEntity>> {
    return this.merchantService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: number): Promise<MerchantEntity | undefined> {
    return this.merchantService.findOne({id});
  }
}
