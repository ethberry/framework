import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc998TokenService } from "./token.service";
import { Erc998TokenEntity } from "./token.entity";
import { Erc998TokenSearchDto, Erc998TokenUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/erc998-tokens")
export class Erc998TokenController {
  constructor(private readonly erc998TokenService: Erc998TokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc998TokenSearchDto): Promise<[Array<Erc998TokenEntity>, number]> {
    return this.erc998TokenService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<Erc998TokenEntity>> {
    return this.erc998TokenService.autocomplete();
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: Erc998TokenUpdateDto): Promise<Erc998TokenEntity> {
    return this.erc998TokenService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc998TokenEntity | null> {
    return this.erc998TokenService.findOne({ id }, { relations: { erc998Template: true } });
  }
}
