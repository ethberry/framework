import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { PaginationDto } from "@gemunion/collection";

import { WalletService } from "./wallet.service";
import { BalanceEntity } from "../../hierarchy/balance/balance.entity";
import { PayeesService } from "./payees.service";
import { PayeesEntity } from "./payees.entity";
import { BalanceSearchDto } from "../../hierarchy/balance/dto";

@ApiBearerAuth()
@Controller("/wallet")
export class WalletController {
  constructor(private readonly walletService: WalletService, private readonly payeesService: PayeesService) {}

  @Get("/balances")
  @UseInterceptors(PaginationInterceptor)
  @UseInterceptors(NotFoundInterceptor)
  public getWalletBalance(@Query() dto: BalanceSearchDto): Promise<[Array<BalanceEntity>, number]> {
    return this.walletService.getWalletBalance(dto);
  }

  @Get("/history")
  @UseInterceptors(PaginationInterceptor)
  @UseInterceptors(NotFoundInterceptor)
  public getExchangeBalanceHistory(@Query() dto: BalanceSearchDto): Promise<[Array<BalanceEntity>, number]> {
    return this.walletService.getWalletBalance(dto);
  }

  @Get("/payees/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PaginationDto): Promise<[Array<PayeesEntity>, number]> {
    return this.payeesService.search(dto);
  }

  @Get("/payees/autocomplete")
  public autocomplete(): Promise<Array<PayeesEntity>> {
    return this.payeesService.autocomplete();
  }
}
