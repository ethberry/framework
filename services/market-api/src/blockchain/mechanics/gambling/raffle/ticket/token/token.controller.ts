import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@ethberry/nest-js-utils";

import { RaffleTicketTokenSearchDto } from "./dto";
import { RaffleTicketTokenService } from "./token.service";
import { UserEntity } from "../../../../../../infrastructure/user/user.entity";
import { TokenEntity } from "../../../../../hierarchy/token/token.entity";

@ApiBearerAuth()
@Controller("/raffle/ticket/tokens")
export class RaffleTicketTokenController {
  constructor(private readonly raffleTicketTokenService: RaffleTicketTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: RaffleTicketTokenSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TokenEntity>, number]> {
    return this.raffleTicketTokenService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.raffleTicketTokenService.findOneWithRelations({ id });
  }
}
