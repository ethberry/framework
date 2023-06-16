import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";
import { ModuleType } from "@framework/types";
import { testChainId } from "@framework/constants";

import { TemplateService } from "./template.service";
import { TemplateEntity } from "./template.entity";
import { TemplateNewDto } from "./dto/new";
import { UserEntity } from "../../../infrastructure/user/user.entity";
import { TemplateAutocompleteDto } from "./dto/autocomplete";

@Public()
@Controller("/templates")
export class TemplateController {
  constructor(private readonly templateService: TemplateService, private readonly configService: ConfigService) {}

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(
    @Query() dto: TemplateNewDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    return this.templateService.search(
      { take: 10 },
      userEntity?.chainId || chainId,
      dto.contractType,
      ModuleType.HIERARCHY,
    );
  }

  @Get("/autocomplete")
  public autocomplete(@Query() dto: TemplateAutocompleteDto): Promise<Array<TemplateEntity>> {
    return this.templateService.autocomplete(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.templateService.findOneWithRelations({ id });
  }
}
