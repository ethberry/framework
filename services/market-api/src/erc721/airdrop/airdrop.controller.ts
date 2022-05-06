import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../user/user.entity";
import { Erc721AirdropService } from "./airdrop.service";
import { Erc721AirdropEntity } from "./airdrop.entity";
import { Erc721AirdropSearchDto } from "./dto";

@Public()
@ApiBearerAuth()
@Controller("/erc721-airdrop")
export class Erc721AirdropController {
  constructor(private readonly erc721AirdropService: Erc721AirdropService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @User() userEntity: UserEntity,
    @Query() dto: Erc721AirdropSearchDto,
  ): Promise<[Array<Erc721AirdropEntity>, number]> {
    return this.erc721AirdropService.search(userEntity, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc721AirdropEntity | null> {
    return this.erc721AirdropService.findOne({ id }, { relations: { erc721Template: true } });
  }
}
