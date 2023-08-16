import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { Public } from "@gemunion/nest-js-utils";

import { RaffleRoundService } from "./round.service";
import { RaffleRoundEntity } from "./round.entity";
import { RaffleCurrentDto } from "./dto";
import type { IRaffleRoundStatistic } from "./interfaces";

@Public()
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
  public last(@Query() dto: RaffleCurrentDto): Promise<IRaffleRoundStatistic> {
    return this.raffleRoundService.latest(dto);
  }

  @Get("/:id")
  public statistic(@Param("id", ParseIntPipe) id: number): Promise<IRaffleRoundStatistic> {
    return this.raffleRoundService.statistic(id);
  }
}
