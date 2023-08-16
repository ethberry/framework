import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { LotteryRoundService } from "./round.service";
import { LotteryRoundEntity } from "./round.entity";
import { LotteryCurrentDto } from "./dto";
import type { ILotteryRoundStatistic } from "./interfaces";

@ApiBearerAuth()
@Controller("/lottery/rounds")
export class LotteryRoundController {
  constructor(private readonly lotteryRoundService: LotteryRoundService) {}

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<LotteryRoundEntity>> {
    return this.lotteryRoundService.autocomplete();
  }

  @Get("/current")
  public current(@Query() dto: LotteryCurrentDto): Promise<LotteryRoundEntity> {
    return this.lotteryRoundService.current(dto);
  }

  @Get("/latest")
  public last(@Query() dto: LotteryCurrentDto): Promise<ILotteryRoundStatistic> {
    return this.lotteryRoundService.latest(dto);
  }

  @Get("/:id")
  public statistic(@Param("id", ParseIntPipe) id: number): Promise<ILotteryRoundStatistic> {
    return this.lotteryRoundService.statistic(id);
  }
}
