import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { RaffleTokenSearchDto } from "./dto";
import { RaffleTokentService } from "./token.service";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@ApiBearerAuth()
@Controller("/raffle/tokens")
export class RaffleTokenController {
  constructor(private readonly raffleTicketService: RaffleTokentService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: RaffleTokenSearchDto): Promise<[Array<TokenEntity>, number]> {
    return this.raffleTicketService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.raffleTicketService.findOneWithRelations({ id });
  }
}
