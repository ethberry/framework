import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc721TokenService } from "./token.service";
import { TokenEntity } from "../../blockchain/hierarchy/token/token.entity";
import { TokenSearchDto, TokenUpdateDto } from "../../blockchain/hierarchy/token/dto";

@ApiBearerAuth()
@Controller("/erc721-tokens")
export class Erc721TokenController {
  constructor(private readonly erc721TokenService: Erc721TokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TokenSearchDto): Promise<[Array<TokenEntity>, number]> {
    return this.erc721TokenService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<TokenEntity>> {
    return this.erc721TokenService.autocomplete();
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: TokenUpdateDto): Promise<TokenEntity> {
    return this.erc721TokenService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.erc721TokenService.findOne({ id }, { relations: { template: true } });
  }
}
