import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { RaffleTicketSearchDto } from "./dto";
import { RaffleTicketService } from "./ticket.service";
import { RaffleTicketEntity } from "./ticket.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/raffle/ticket")
export class RaffleTicketController {
  constructor(private readonly raffleTicketService: RaffleTicketService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: RaffleTicketSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<RaffleTicketEntity>, number]> {
    return this.raffleTicketService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<RaffleTicketEntity | null> {
    return this.raffleTicketService.findOne({ id });
  }
}
