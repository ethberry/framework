import { Body, Controller, Get, Post, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import type { IServerSignature } from "@gemunion/types-blockchain";

import { SignRentTokenDto } from "./dto";
import { RentSignService } from "./rent.sign.service";
import { TokenAutocompleteDto, TokenSearchDto } from "../../hierarchy/token/dto";
import { UserEntity } from "../../../infrastructure/user/user.entity";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { RentTokenService } from "./rent.token.service";

@ApiBearerAuth()
@Controller("/rent/tokens")
export class RentController {
  constructor(private readonly rentSignService: RentSignService, private readonly rentTokenService: RentTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TokenSearchDto, @User() userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return this.rentTokenService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: TokenAutocompleteDto, @User() userEntity: UserEntity): Promise<Array<TokenEntity>> {
    return this.rentTokenService.autocomplete(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.rentTokenService.findOneWithRelations({ id });
  }

  @Post("/sign")
  public sign(@Body() dto: SignRentTokenDto): Promise<IServerSignature> {
    return this.rentSignService.sign(dto);
  }
}
