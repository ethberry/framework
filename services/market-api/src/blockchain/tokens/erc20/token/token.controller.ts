import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { Erc20TokenService } from "./token.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenSearchDto } from "../../../hierarchy/token/dto";

@ApiBearerAuth()
@Controller("/erc20/tokens")
export class Erc20TokenController {
  constructor(private readonly erc20TokenService: Erc20TokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TokenSearchDto, @User() userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return this.erc20TokenService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.erc20TokenService.findOneWithRelations({ id });
  }
}
