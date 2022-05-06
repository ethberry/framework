import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { Erc1155TokenService } from "./token.service";
import { Erc1155TokenEntity } from "./token.entity";
import { Erc1155TokenSearchDto } from "./dto";

@Public()
@Controller("/erc1155-tokens")
export class Erc1155TokenController {
  constructor(private readonly erc1155TokenService: Erc1155TokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc1155TokenSearchDto): Promise<[Array<Erc1155TokenEntity>, number]> {
    return this.erc1155TokenService.search(dto);
  }

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(): Promise<[Array<Erc1155TokenEntity>, number]> {
    return this.erc1155TokenService.getNewTokens();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc1155TokenEntity | null> {
    return this.erc1155TokenService.findOne({ id });
  }
}
