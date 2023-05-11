import { Controller, Get, Param, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AddressPipe, NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { BalanceService } from "./balance.service";
import { BalanceEntity } from "./balance.entity";
import { BalanceAutocompleteDto, BalanceSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/balances")
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: BalanceSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<BalanceEntity>, number]> {
    console.log("dto", dto);
    return this.balanceService.search(dto, userEntity);
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
