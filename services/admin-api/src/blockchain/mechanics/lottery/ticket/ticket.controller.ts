import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { LotteryTicketSearchDto } from "./dto";
import { LotteryTicketService } from "./ticket.service";
import { LotteryTicketEntity } from "./ticket.entity";

@ApiBearerAuth()
@Controller("/lottery/tickets")
export class LotteryTicketController {
  constructor(private readonly lotteryTicketService: LotteryTicketService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: LotteryTicketSearchDto): Promise<[Array<LotteryTicketEntity>, number]> {
    return this.lotteryTicketService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<LotteryTicketEntity | null> {
    return this.lotteryTicketService.findOne({ id }, { relations: { token: true, round: true } });
  }
}
