import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc721TokenService } from "./token.service";
import { Erc721TokenSearchDto, Erc721TokenUpdateDto } from "./dto";
import { UniTokenEntity } from "../../blockchain/uni-token/uni-token/uni-token.entity";

@ApiBearerAuth()
@Controller("/erc721-tokens")
export class Erc721TokenController {
  constructor(private readonly erc721TokenService: Erc721TokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721TokenSearchDto): Promise<[Array<UniTokenEntity>, number]> {
    return this.erc721TokenService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<UniTokenEntity>> {
    return this.erc721TokenService.autocomplete();
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: Erc721TokenUpdateDto): Promise<UniTokenEntity> {
    return this.erc721TokenService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UniTokenEntity | null> {
    return this.erc721TokenService.findOne({ id }, { relations: { uniTemplate: true } });
  }
}
