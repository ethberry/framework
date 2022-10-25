import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { PaginationDto } from "@gemunion/collection";

import { WalletService } from "./wallet.service";
import { BalanceEntity } from "../hierarchy/balance/balance.entity";
import { PayeesService } from "./wallet-payees.service";
import { WalletPayeesEntity } from "./wallet-payees.entity";
import { BalanceSearchDto } from "../hierarchy/balance/dto";

@ApiBearerAuth()
@Controller("/payees")
export class WalletController {
  constructor(private readonly walletService: WalletService, private readonly payeesService: PayeesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PaginationDto): Promise<[Array<WalletPayeesEntity>, number]> {
    return this.payeesService.search(dto);
  }

  @Get("/balances")
  @UseInterceptors(PaginationInterceptor)
  @UseInterceptors(NotFoundInterceptor)
  public getExchangeBalance(@Query() dto: BalanceSearchDto): Promise<[Array<BalanceEntity>, number]> {
    return this.walletService.getExchangeBalance(dto);
  }
}
