import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { MergeService } from "./merge.service";
import { MergeEntity } from "./merge.entity";
import { MergeSignDto, MergeSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/recipes/merge")
export class MergeController {
  constructor(private readonly mergeService: MergeService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: MergeSearchDto, @User() userEntity: UserEntity): Promise<[Array<MergeEntity>, number]> {
    return this.mergeService.search(dto, userEntity);
  }

  @Post("/sign")
  public sign(@Body() dto: MergeSignDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.mergeService.sign(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<MergeEntity | null> {
    return this.mergeService.findOneWithRelations({ id });
  }
}
