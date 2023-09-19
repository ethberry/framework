import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor } from "@gemunion/nest-js-utils";

import { RaffleRoundService } from "./round.service";
import { RaffleRoundEntity } from "./round.entity";
import { RaffleCurrentDto } from "./dto";

@ApiBearerAuth()
@Controller("/raffle/rounds")
export class RaffleRoundController {
  constructor(private readonly raffleRoundService: RaffleRoundService) {}

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<RaffleRoundEntity>> {
    return this.raffleRoundService.autocomplete();
  }

  @Get("/current")
  public current(@Query() dto: RaffleCurrentDto): Promise<RaffleRoundEntity> {
    return this.raffleRoundService.current(dto);
  }

  @Get("/latest")
  @UseInterceptors(NotFoundInterceptor)
  public last(@Query() dto: RaffleCurrentDto): Promise<RaffleRoundEntity | null> {
    return this.raffleRoundService.latest(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public statistic(@Param("id", ParseIntPipe) id: number): Promise<RaffleRoundEntity | null> {
    return this.raffleRoundService.statistic(id);
  }
}
