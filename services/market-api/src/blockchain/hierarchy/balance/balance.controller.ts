import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { BalanceService } from "./balance.service";
import { BalanceEntity } from "./balance.entity";
import { BalanceSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/balances")
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: BalanceSearchDto): Promise<[Array<BalanceEntity>, number]> {
    return this.balanceService.search(dto);
  }
}
