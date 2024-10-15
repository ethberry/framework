import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@ethberry/nest-js-utils";

import { MerchantEntity } from "../../../../../../infrastructure/merchant/merchant.entity";
import { TokenEntity } from "../../../../../hierarchy/token/token.entity";
import { RaffleTicketTokenService } from "./token.service";
import { RaffleTicketTokenSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/raffle/ticket/tokens")
export class RaffleTicketTokenController {
  constructor(private readonly raffleTicketTokenService: RaffleTicketTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: RaffleTicketTokenSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<TokenEntity>, number]> {
    return this.raffleTicketTokenService.search(dto, merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Param("id", ParseIntPipe) id: number,
    @User() merchantEntity: MerchantEntity,
  ): Promise<TokenEntity | null> {
    return this.raffleTicketTokenService.findOneAndCheckMerchant({ id }, merchantEntity);
  }
}
