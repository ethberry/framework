import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc998TokenService } from "./token.service";
import { Erc998TokenSearchDto, Erc998TokenUpdateDto } from "./dto";
import { UniTokenEntity } from "../../uni-token/uni-token.entity";

@ApiBearerAuth()
@Controller("/erc998-tokens")
export class Erc998TokenController {
  constructor(private readonly erc998TokenService: Erc998TokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc998TokenSearchDto): Promise<[Array<UniTokenEntity>, number]> {
    return this.erc998TokenService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<UniTokenEntity>> {
    return this.erc998TokenService.autocomplete();
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: Erc998TokenUpdateDto): Promise<UniTokenEntity> {
    return this.erc998TokenService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UniTokenEntity | null> {
    return this.erc998TokenService.findOne({ id }, { relations: { uniTemplate: true } });
  }
}
