import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { LotteryTicketSearchDto } from "./dto";
import { LotteryTicketService } from "./ticket.service";
import { LotteryTicketEntity } from "./ticket.entity";
import { UserEntity } from "../../../../ecommerce/user/user.entity";

@ApiBearerAuth()
@Controller("/lottery/ticket")
export class LotteryTicketController {
  constructor(private readonly lotteryTicketService: LotteryTicketService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: LotteryTicketSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<LotteryTicketEntity>, number]> {
    return this.lotteryTicketService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<LotteryTicketEntity | null> {
    return this.lotteryTicketService.findOne({ id }, { relations: { round: true } });
  }
}
