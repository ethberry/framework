import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { RaffleTicketSearchDto } from "./dto";
import { RaffleTicketService } from "./ticket.service";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@ApiBearerAuth()
@Controller("/raffle/tickets")
export class RaffleTicketController {
  constructor(private readonly raffleTicketService: RaffleTicketService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: RaffleTicketSearchDto): Promise<[Array<TokenEntity>, number]> {
    return this.raffleTicketService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.raffleTicketService.findOneWithRelations({ id });
  }
}
