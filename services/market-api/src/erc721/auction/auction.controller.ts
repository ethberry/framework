import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";

import { PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { AuctionService } from "./auction.service";
import { Erc721AuctionEntity } from "./auction.entity";
import { AuctionSortDto } from "./dto";

@Public()
@Controller("/erc721-auction")
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: AuctionSortDto): Promise<[Array<Erc721AuctionEntity>, number]> {
    return this.auctionService.search(dto);
  }
}
