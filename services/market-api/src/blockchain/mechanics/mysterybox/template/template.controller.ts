import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";

import { MysteryboxTemplateService } from "./template.service";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateSearchDto } from "../../../hierarchy/template/dto";
import { UserEntity } from "../../../../user/user.entity";

@Public()
@Controller("/mysterybox-templates")
export class MysteryboxTemplateController {
  constructor(private readonly mysteryboxTemplateService: MysteryboxTemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: TemplateSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    return this.mysteryboxTemplateService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<TemplateEntity>> {
    return this.mysteryboxTemplateService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.mysteryboxTemplateService.findOneWithRelations({ id });
  }
}
