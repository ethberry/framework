import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";
import { testChainId } from "@framework/constants";

import { Erc721TemplateService } from "./template.service";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateSearchDto } from "../../../hierarchy/template/dto";
import { UserEntity } from "../../../../user/user.entity";

@Public()
@Controller("/erc721-templates")
export class Erc721TemplateController {
  constructor(
    private readonly erc721TemplateService: Erc721TemplateService,
    private readonly configService: ConfigService,
  ) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: TemplateSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);
    return this.erc721TemplateService.search(dto, userEntity?.chainId || chainId);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.erc721TemplateService.findOneWithRelations({ id });
  }
}
