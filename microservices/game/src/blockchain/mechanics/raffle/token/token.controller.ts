import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { RaffleTokenService } from "./token.service";
import { RaffleTicketSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/raffle/tokens")
export class RaffleTokenController {
  constructor(private readonly raffleTicketService: RaffleTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: RaffleTicketSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<TokenEntity>, number]> {
    return this.raffleTicketService.search(dto, merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Param("id", ParseIntPipe) id: number,
    @User() merchantEntity: MerchantEntity,
  ): Promise<TokenEntity | null> {
    return this.raffleTicketService.findOneWithRelationsOrFail({ id }, merchantEntity);
  }
}
