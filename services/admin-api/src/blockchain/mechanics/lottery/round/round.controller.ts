import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { LotteryRoundSearchDto } from "./dto";
import { LotteryRoundService } from "./round.service";
import { LotteryRoundEntity } from "./round.entity";

@ApiBearerAuth()
@Controller("/lottery/rounds")
export class LotteryRoundController {
  constructor(private readonly lotteryRoundService: LotteryRoundService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: LotteryRoundSearchDto): Promise<[Array<LotteryRoundEntity>, number]> {
    return this.lotteryRoundService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<LotteryRoundEntity | null> {
    return this.lotteryRoundService.findOne({ id });
  }
}
