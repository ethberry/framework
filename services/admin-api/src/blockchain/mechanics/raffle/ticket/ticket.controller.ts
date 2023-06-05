import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { RaffleTicketSearchDto } from "./dto";
import { RaffleTicketService } from "./ticket.service";
import { RaffleTicketEntity } from "./ticket.entity";

@ApiBearerAuth()
@Controller("/raffle/tickets")
export class RaffleTicketController {
  constructor(private readonly raffleTicketService: RaffleTicketService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: RaffleTicketSearchDto): Promise<[Array<RaffleTicketEntity>, number]> {
    return this.raffleTicketService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<RaffleTicketEntity | null> {
    return this.raffleTicketService.findOne({ id }, { relations: { token: true, round: true } });
  }
}
