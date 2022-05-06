import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";

import { PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { Erc721AuctionHistoryService } from "./auction-history.service";
import { Erc721AuctionHistoryEntity } from "./auction-history.entity";
import { Erc721AuctionHistorySearchDto } from "./dto";

@Public()
@Controller("/erc721-auction/history")
export class Erc721AuctionHistoryController {
  constructor(private readonly erc721AuctionHistoryService: Erc721AuctionHistoryService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721AuctionHistorySearchDto): Promise<[Array<Erc721AuctionHistoryEntity>, number]> {
    return this.erc721AuctionHistoryService.search(dto);
  }
}
