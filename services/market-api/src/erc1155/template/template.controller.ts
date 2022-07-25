import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public } from "@gemunion/nest-js-utils";

import { Erc1155TemplateService } from "./template.service";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";
import { TemplateSearchDto } from "../../blockchain/hierarchy/template/dto";

@Public()
@Controller("/erc1155-templates")
export class Erc1155TemplateController {
  constructor(private readonly erc1155TokenService: Erc1155TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: TemplateSearchDto): Promise<[Array<TemplateEntity>, number]> {
    return this.erc1155TokenService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.erc1155TokenService.findOneWithRelations({ id });
  }
}
