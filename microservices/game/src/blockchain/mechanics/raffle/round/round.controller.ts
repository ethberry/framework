import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, User } from "@gemunion/nest-js-utils";

import { RaffleRoundService } from "./round.service";
import { RaffleRoundEntity } from "./round.entity";
import { RaffleCurrentDto } from "./dto";
import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";

@ApiBearerAuth()
@Controller("/raffle/rounds")
export class RaffleRoundController {
  constructor(private readonly raffleRoundService: RaffleRoundService) {}

  @Get("/autocomplete")
  public autocomplete(@User() merchantEntity: MerchantEntity): Promise<Array<RaffleRoundEntity>> {
    return this.raffleRoundService.autocomplete(merchantEntity);
  }

  @Get("/current")
  public current(@Query() dto: RaffleCurrentDto, @User() merchantEntity: MerchantEntity): Promise<RaffleRoundEntity> {
    return this.raffleRoundService.current(dto, merchantEntity);
  }

  @Get("/latest")
  @UseInterceptors(NotFoundInterceptor)
  public last(
    @Query() dto: RaffleCurrentDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<RaffleRoundEntity | null> {
    return this.raffleRoundService.latest(dto, merchantEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public statistic(
    @Param("id", ParseIntPipe) id: number,
    @User() merchantEntity: MerchantEntity,
  ): Promise<RaffleRoundEntity | null> {
    return this.raffleRoundService.statistic(id, merchantEntity);
  }
}
