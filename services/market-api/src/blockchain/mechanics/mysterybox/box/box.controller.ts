import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";

import { MysteryboxSearchDto } from "./dto";
import { MysteryboxBoxService } from "./box.service";
import { MysteryboxBoxEntity } from "./box.entity";
import { UserEntity } from "../../../../user/user.entity";
import { TemplateNewDto } from "../../../hierarchy/template/dto/new";

@Public()
@Controller("/mysterybox-boxes")
export class MysteryboxBoxController {
  constructor(
    private readonly mysteryboxBoxService: MysteryboxBoxService,
    private readonly configService: ConfigService,
  ) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: MysteryboxSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<MysteryboxBoxEntity>, number]> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", "1337");
    return this.mysteryboxBoxService.search(dto, userEntity?.chainId || chainId);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<MysteryboxBoxEntity>> {
    return this.mysteryboxBoxService.autocomplete();
  }

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(
    @Query() dto: TemplateNewDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<MysteryboxBoxEntity>, number]> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", "1337");
    return this.mysteryboxBoxService.search({ take: 10 }, userEntity?.chainId || chainId);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<MysteryboxBoxEntity | null> {
    return this.mysteryboxBoxService.findOneWithRelations({ id });
  }
}
