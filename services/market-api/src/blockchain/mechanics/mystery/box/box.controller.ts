import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";
import { testChainId } from "@framework/constants";

import { MysteryboxSearchDto } from "./dto";
import { MysteryBoxService } from "./box.service";
import { MysteryBoxEntity } from "./box.entity";
import { UserEntity } from "../../../../ecommerce/user/user.entity";
import { TemplateNewDto } from "../../../hierarchy/template/dto/new";

@Public()
@Controller("/mystery-boxes")
export class MysteryBoxController {
  constructor(private readonly mysteryBoxService: MysteryBoxService, private readonly configService: ConfigService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: MysteryboxSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<MysteryBoxEntity>, number]> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);
    return this.mysteryBoxService.search(dto, userEntity?.chainId || chainId);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<MysteryBoxEntity>> {
    return this.mysteryBoxService.autocomplete();
  }

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(
    @Query() dto: TemplateNewDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<MysteryBoxEntity>, number]> {
    const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);
    return this.mysteryBoxService.search({ take: 10 }, userEntity?.chainId || chainId);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<MysteryBoxEntity | null> {
    return this.mysteryBoxService.findOneWithRelations({ id });
  }
}
