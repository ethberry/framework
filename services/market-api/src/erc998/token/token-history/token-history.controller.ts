import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";

import { PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { Erc998TokenHistoryService } from "./token-history.service";
import { Erc998TokenHistoryEntity } from "./token-history.entity";
import { Erc998TokenHistorySearchDto } from "./dto";

@Controller("/erc998-token-history")
export class Erc998TokenHistoryController {
  constructor(private readonly erc998TokenHistoryService: Erc998TokenHistoryService) {}

  @Public()
  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc998TokenHistorySearchDto): Promise<[Array<Erc998TokenHistoryEntity>, number]> {
    return this.erc998TokenHistoryService.search(dto);
  }
}
