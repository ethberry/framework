import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { LotteryTokenSearchDto } from "./dto";
import { LotteryTokenService } from "./token.service";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@ApiBearerAuth()
@Controller("/lottery/tokens")
export class LotteryTokenController {
  constructor(private readonly lotteryTicketService: LotteryTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: LotteryTokenSearchDto): Promise<[Array<TokenEntity>, number]> {
    return this.lotteryTicketService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.lotteryTicketService.findOneWithRelations({ id });
  }
}
