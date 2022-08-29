import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";

import { Erc998TemplateService } from "./template.service";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateSearchDto } from "../../../hierarchy/template/dto";
import { UserEntity } from "../../../../user/user.entity";

@Public()
@Controller("/erc998-templates")
export class Erc998TemplateController {
  constructor(
    private readonly erc998TemplateService: Erc998TemplateService,
    private readonly configService: ConfigService,
  ) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: TemplateSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", "1337");
    return this.erc998TemplateService.search(dto, userEntity?.chainId || chainId);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<TemplateEntity>> {
    return this.erc998TemplateService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.erc998TemplateService.findOneWithRelations({ id });
  }
}
