import { Controller, Get, Param, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AddressPipe, NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { BalanceService } from "./balance.service";
import { BalanceEntity } from "./balance.entity";
import { BalanceAutocompleteDto, BalanceSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/balances")
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: BalanceSearchDto): Promise<[Array<BalanceEntity>, number]> {
    return this.balanceService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: BalanceAutocompleteDto): Promise<Array<BalanceEntity>> {
    return this.balanceService.autocomplete(dto);
  }

  @Get("/:address")
  @UseInterceptors(NotFoundInterceptor)
  public findAccountBalances(@Param("address", AddressPipe) address: string): Promise<Array<BalanceEntity>> {
    return this.balanceService.searchByAddress(address);
  }
}
