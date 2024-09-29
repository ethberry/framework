import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@ethberry/nest-js-utils";

import { RaffleTokenSearchDto } from "./dto";
import { RaffleTicketTokentService } from "./token.service";
import { TokenEntity } from "../../../../../hierarchy/token/token.entity";

@ApiBearerAuth()
@Controller("/raffle/ticket/tokens")
export class RaffleTicketTokenController {
  constructor(private readonly raffleTicketTokentService: RaffleTicketTokentService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: RaffleTokenSearchDto): Promise<[Array<TokenEntity>, number]> {
    return this.raffleTicketTokentService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.raffleTicketTokentService.findOneWithRelations({ id });
  }
}
