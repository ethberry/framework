import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor } from "@gemunion/nest-js-utils";

import { LotteryRoundService } from "./round.service";
import { LotteryRoundEntity } from "./round.entity";
import { LotteryCurrentDto } from "./dto";

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
  @UseInterceptors(NotFoundInterceptor)
  public last(@Query() dto: LotteryCurrentDto): Promise<LotteryRoundEntity | null> {
    return this.lotteryRoundService.latest(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public statistic(@Param("id", ParseIntPipe) id: number): Promise<LotteryRoundEntity | null> {
    return this.lotteryRoundService.statistic(id);
  }
}
