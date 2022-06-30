import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { Erc1155BalanceService } from "./balance.service";
import { UserEntity } from "../../user/user.entity";
import { BalanceEntity } from "../../blockchain/hierarchy/balance/balance.entity";

@ApiBearerAuth()
@Controller("/erc1155-balances")
export class Erc1155BalanceController {
  constructor(private readonly erc1155BalanceService: Erc1155BalanceService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@User() userEntity: UserEntity): Promise<[Array<BalanceEntity>, number]> {
    return this.erc1155BalanceService.search(userEntity);
  }
}
