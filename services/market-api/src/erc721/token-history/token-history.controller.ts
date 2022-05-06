import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";

import { PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { Erc721TokenHistoryService } from "./token-history.service";
import { Erc721TokenHistoryEntity } from "./token-history.entity";
import { Erc721TokenHistorySearchDto } from "./dto";

@Public()
@Controller("/erc721-token/history")
export class Erc721TokenHistoryController {
  constructor(private readonly erc721TokenHistoryService: Erc721TokenHistoryService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721TokenHistorySearchDto): Promise<[Array<Erc721TokenHistoryEntity>, number]> {
    return this.erc721TokenHistoryService.search(dto);
  }
}
