import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";
import { PaginationDto } from "@gemunion/collection";

import { LotteryRoundService } from "./round.service";
import { LotteryRoundEntity } from "./round.entity";

@Public()
@ApiBearerAuth()
@Controller("/lottery/rounds")
export class LotteryRoundController {
  constructor(private readonly lotteryRoundService: LotteryRoundService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PaginationDto): Promise<[Array<LotteryRoundEntity>, number]> {
    return this.lotteryRoundService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<LotteryRoundEntity>> {
    return this.lotteryRoundService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<LotteryRoundEntity | null> {
    return this.lotteryRoundService.findOne({ id });
  }
}
