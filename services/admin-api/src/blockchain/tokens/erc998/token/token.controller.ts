import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { Erc998TokenService } from "./token.service";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenSearchDto } from "../../../hierarchy/token/dto";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/erc998-tokens")
export class Erc998TokenController {
  constructor(private readonly erc998TokenService: Erc998TokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TokenSearchDto, @User() userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return this.erc998TokenService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.erc998TokenService.findOne(
      { id },
      {
        relations: {
          template: {
            contract: true,
          },
          balance: true,
        },
      },
    );
  }
}
