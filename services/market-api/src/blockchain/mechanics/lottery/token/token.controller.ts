import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { LotteryTicketSearchDto } from "./dto";
import { LotteryTokenService } from "./token.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@ApiBearerAuth()
@Controller("/lottery/tokens")
export class LotteryTokenController {
  constructor(private readonly lotteryTicketService: LotteryTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: LotteryTicketSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TokenEntity>, number]> {
    return this.lotteryTicketService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.lotteryTicketService.findOneWithRelations({ id });
  }
}
