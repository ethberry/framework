import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { Public } from "@gemunion/nest-js-utils";

import { LotteryRoundService } from "./round.service";
import { LotteryRoundEntity } from "./round.entity";

@Public()
@ApiBearerAuth()
@Controller("/lottery/rounds")
export class LotteryRoundController {
  constructor(private readonly lotteryRoundService: LotteryRoundService) {}

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<LotteryRoundEntity>> {
    return this.lotteryRoundService.autocomplete();
  }
}
