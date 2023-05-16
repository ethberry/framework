import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import type { IServerSignature } from "@gemunion/types-blockchain";

import { SignRentTokenDto } from "./dto";
import { RentSignService } from "./rent.sign.service";
import { TokenSearchDto } from "../../hierarchy/token/dto";
import { UserEntity } from "../../../infrastructure/user/user.entity";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { RentTokenService } from "./rent.token.service";
import { RentAutocompleteDto } from "./dto/autocomplete";
import { RentEntity } from "./rent.entity";
import { RentService } from "./rent.service";

@ApiBearerAuth()
@Controller("/rent")
export class RentController {
  constructor(
    private readonly rentSignService: RentSignService,
    private readonly rentTokenService: RentTokenService,
    private readonly rentService: RentService,
  ) {}

  @Get("/tokens")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TokenSearchDto, @User() userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return this.rentTokenService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: RentAutocompleteDto): Promise<Array<RentEntity>> {
    return this.rentService.autocomplete(dto);
  }

  @Get("/tokens/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.rentTokenService.findOneWithRelations({ id });
  }

  @Post("/tokens/sign")
  public sign(@Body() dto: SignRentTokenDto): Promise<IServerSignature> {
    return this.rentSignService.sign(dto);
  }
}
