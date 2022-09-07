import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { MysteryTokenService } from "./token.service";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenSearchDto } from "../../../hierarchy/token/dto";
import { UserEntity } from "../../../../user/user.entity";

@ApiBearerAuth()
@Controller("/mystery-tokens")
export class MysteryTokenController {
  constructor(private readonly mysteryTokenService: MysteryTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TokenSearchDto, @User() userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return this.mysteryTokenService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.mysteryTokenService.findOne({ id }, { relations: { template: true, balance: true } });
  }
}
