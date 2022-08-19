import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";

import { Erc721TemplateService } from "./template.service";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateSearchDto } from "../../../hierarchy/template/dto";
import { UserEntity } from "../../../../user/user.entity";

@Public()
@Controller("/erc721-templates")
export class Erc721TemplateController {
  constructor(private readonly erc721TemplateService: Erc721TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: TemplateSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    return this.erc721TemplateService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<TemplateEntity>> {
    return this.erc721TemplateService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.erc721TemplateService.findOneWithRelations({ id });
  }
}
