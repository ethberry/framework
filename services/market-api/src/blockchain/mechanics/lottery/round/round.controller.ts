import { Query, Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { Public } from "@gemunion/nest-js-utils";
import type { ILotteryScheduleUpdateDto } from "@framework/types";

import { LotteryRoundService } from "./round.service";
import { LotteryRoundEntity } from "./round.entity";
import { LotteryOptionsDto } from "./dto";

@Public()
@ApiBearerAuth()
@Controller("/lottery/rounds")
export class LotteryRoundController {
  constructor(private readonly lotteryRoundService: LotteryRoundService) {}

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<LotteryRoundEntity>> {
    return this.lotteryRoundService.autocomplete();
  }

  @Get("/options")
  public options(@Query() dto: LotteryOptionsDto): Promise<ILotteryScheduleUpdateDto> {
    return this.lotteryRoundService.options(dto);
  }
}
