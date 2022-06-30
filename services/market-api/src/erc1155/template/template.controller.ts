import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { Erc1155TemplateService } from "./template.service";
import { Erc1155TemplateSearchDto } from "./dto";
import { UniTemplateEntity } from "../../blockchain/uni-token/uni-template/uni-template.entity";

@Public()
@Controller("/erc1155-tokens")
export class Erc1155TokenController {
  constructor(private readonly erc1155TokenService: Erc1155TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc1155TemplateSearchDto): Promise<[Array<UniTemplateEntity>, number]> {
    return this.erc1155TokenService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UniTemplateEntity | null> {
    return this.erc1155TokenService.findOne({ id });
  }
}
