import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc998TokenService } from "./token.service";
import { TokenEntity } from "../../../blockchain/hierarchy/token/token.entity";
import { TokenSearchDto } from "../../../blockchain/hierarchy/token/dto";

@ApiBearerAuth()
@Controller("/erc998-tokens")
export class Erc998TokenController {
  constructor(private readonly erc998TokenService: Erc998TokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TokenSearchDto): Promise<[Array<TokenEntity>, number]> {
    return this.erc998TokenService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<TokenEntity>> {
    return this.erc998TokenService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.erc998TokenService.findOne({ id }, { relations: { template: true } });
  }
}
