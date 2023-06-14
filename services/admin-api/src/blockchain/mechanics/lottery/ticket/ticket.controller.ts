import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { LotteryTicketSearchDto } from "./dto";
import { LotteryTicketService } from "./ticket.service";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@ApiBearerAuth()
@Controller("/lottery/tickets")
export class LotteryTicketController {
  constructor(private readonly lotteryTicketService: LotteryTicketService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: LotteryTicketSearchDto): Promise<[Array<TokenEntity>, number]> {
    return this.lotteryTicketService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.lotteryTicketService.findOneWithRelations({ id });
  }
}
