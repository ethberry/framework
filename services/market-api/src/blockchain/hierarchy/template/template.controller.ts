import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";
import { ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { TemplateService } from "./template.service";
import { TemplateEntity } from "./template.entity";
import { TemplateAutocompleteDto, TemplateNewDto, TemplateSearchDto } from "./dto";

@Public()
@Controller("/templates")
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: TemplateSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    return this.templateService.search(
      dto,
      userEntity,
      [ModuleType.HIERARCHY],
      [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155],
    );
  }

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(
    @Query() dto: TemplateNewDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    return this.templateService.search(
      Object.assign(dto, {
        take: 10,
      }),
      userEntity,
      [ModuleType.HIERARCHY],
      [dto.contractType],
    );
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: TemplateAutocompleteDto,
    @User() userEntity: UserEntity,
  ): Promise<Array<TemplateEntity>> {
    return this.templateService.autocomplete(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.templateService.findOneWithRelations({ id });
  }
}
