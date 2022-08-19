import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { MarketplaceService } from "./marketplace.service";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { MarketplaceInsightsSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/marketplace")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get("/insights")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: MarketplaceInsightsSearchDto): Promise<[Array<TokenEntity>, number]> {
    return this.marketplaceService.search(dto);
  }
}
