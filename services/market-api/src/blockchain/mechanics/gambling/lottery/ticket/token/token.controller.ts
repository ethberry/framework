import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@ethberry/nest-js-utils";

import { LotteryTicketTokenSearchDto } from "./dto";
import { LotteryTicketTokenService } from "./token.service";
import { UserEntity } from "../../../../../../infrastructure/user/user.entity";
import { TokenEntity } from "../../../../../hierarchy/token/token.entity";

@ApiBearerAuth()
@Controller("/lottery/ticket/tokens")
export class LotteryTicketTokenController {
  constructor(private readonly lotteryTicketTokenService: LotteryTicketTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: LotteryTicketTokenSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TokenEntity>, number]> {
    return this.lotteryTicketTokenService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.lotteryTicketTokenService.findOneWithRelations({ id });
  }
}
